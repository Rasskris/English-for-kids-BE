import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { RequestParam, WordFiles } from '../interfaces';
import { WordsService } from './words.service';
import { CreateWordDto, UpdateWordDto } from './dto';

@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Get(':id')
  async getWord(@Param() { id }: RequestParam) {
    return this.wordsService.getWord(Number(id));
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  async createWord(@Body() wordData: CreateWordDto, @UploadedFiles() files: WordFiles) {
    return this.wordsService.createWord(wordData, files);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  async updateWord(
    @Body() wordData: UpdateWordDto,
    @Param() { id }: RequestParam,
    @UploadedFiles() files?: WordFiles,
  ) {
    return this.wordsService.updateWord(wordData, Number(id), files);
  }

  @Delete(':id')
  async deleteWord(@Param() { id }: RequestParam) {
    return this.wordsService.deleteWord(Number(id));
  }
}
