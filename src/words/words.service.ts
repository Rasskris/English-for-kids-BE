import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ENTITY_NAME,
  QUERY_NAME,
  wordFieldNames,
  WORD_FIELD_NAME,
} from '../constants';
import { EntityNotFoudException } from '../exeptions';
import { CreateWordDto, UpdateWordDto } from './dto';
import { Word } from './word.entity';
import { FilesService, File } from '../files/';
import { WordFiles } from '../interfaces';
import { MulterFile } from '../types';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(Word)
    private wordsRepository: Repository<Word>,
    private readonly filesService: FilesService,
  ) {}

  async getWord(id: number) {
    const word = await this.wordsRepository.findOne({ id });

    if (word) {
      return word;
    }
    throw new EntityNotFoudException(ENTITY_NAME.WORD, QUERY_NAME.ID, id);
  }

  async createWord(wordData: CreateWordDto, wordFiles: WordFiles) {
    const { image: imageFile, audio: audioFile } = wordFiles;
    const image = await this.addWordFile(imageFile);
    const audio = await this.addWordFile(audioFile);
    const newWord = await this.wordsRepository.create({
      ...wordData,
      image,
      audio,
    });
    const savedWord = await this.wordsRepository.save(newWord);

    return savedWord;
  }

  async addWordFile(wordFile: MulterFile) {
    const { buffer, originalname } = wordFile[0];
    const file = await this.filesService.uploadFile(buffer, originalname);

    return file;
  }

  async deleteWordFile(word: Word, fieldName: WORD_FIELD_NAME) {
    await this.filesService.deleteFile(word[fieldName].id);
  }

  // TODO refactor
  async updateWord(wordData: UpdateWordDto, id: number, files: WordFiles) {
    const { image: imageFile, audio: audioFile } = files;
    const word = await this.getWord(id);

    let image: File | null;
    let audio: File | null;

    if (imageFile) {
      await this.deleteWordFile(word, WORD_FIELD_NAME.IMAGE);
      image = await this.addWordFile(imageFile);
      word.image = image;
    }

    if (audioFile) {
      await this.deleteWordFile(word, WORD_FIELD_NAME.AUDIO);
      audio = await this.addWordFile(audioFile);
      word.audio = audio;
    }

    await this.wordsRepository.update(id, {
      ...word,
      ...wordData,
    });
    const updatedWord = this.getWord(id);

    return updatedWord;
  }

  async deleteWord(id: number) {
    const word = await this.getWord(id);
    const { affected } = await this.wordsRepository.delete(id);

    if (affected) {
      wordFieldNames.forEach(
        async (fieldName: WORD_FIELD_NAME) =>
          await this.deleteWordFile(word, fieldName),
      );

      return id;
    }
    throw new EntityNotFoudException(ENTITY_NAME.WORD, QUERY_NAME.ID, id);
  }
}
