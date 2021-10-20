import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from '../categories';
import { ENTITY_NAME, QUERY_NAME } from 'src/constants';
import { Repository } from 'typeorm';
import { EntityNotFoudException } from '../exeptions';
import { CreateWordDto, UpdateWordDto } from './dto';
import { Word } from './word.entity';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(Word)
    private wordsRepository: Repository<Word>,
    @Inject(forwardRef(() => CategoriesService))
    private readonly categoriesService: CategoriesService,
  ) {}

  async getWord(id: number) {
    const word = await this.wordsRepository.findOne({ id });

    if (word) {
      return word;
    }
    throw new EntityNotFoudException(ENTITY_NAME.WORD, QUERY_NAME.ID, id);
  }

  async createWord(wordData: CreateWordDto, categoryId: number) {
    const category = await this.categoriesService.getCategory(categoryId);
    const newWord = await this.wordsRepository.create({
      ...wordData,
      category,
    });
    const savedWord = await this.wordsRepository.save(newWord);

    return savedWord;
  }

  async updateWord(wordData: UpdateWordDto, id: number) {
    await this.wordsRepository.update(id, wordData);
    const updatedWord = this.getWord(id);

    return updatedWord;
  }

  async deleteWord(id: number) {
    const { affected } = await this.wordsRepository.delete(id);

    if (affected) {
      return id;
    }
    throw new EntityNotFoudException(ENTITY_NAME.WORD, QUERY_NAME.ID, id);
  }
}
