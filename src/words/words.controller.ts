import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RequestParam } from 'src/interfaces';
import { WordsService } from './words.service';
import { CreateWordDto, UpdateWordDto } from './dto';

@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Get(':id')
  async getWord(@Param() { id }: RequestParam) {
    return this.wordsService.getWord(Number(id));
  }

  @Post(':categoryId')
  async createWord(
    @Body() wordData: CreateWordDto,
    @Param() { categoryId }: RequestParam,
  ) {
    return this.wordsService.createWord(wordData, Number(categoryId));
  }

  @Patch(':id')
  async updateWord(
    @Body() wordData: UpdateWordDto,
    @Param() { id }: RequestParam,
  ) {
    return this.wordsService.updateWord(wordData, Number(id));
  }

  @Delete(':id')
  async deleteWord(@Param() { id }: RequestParam) {
    return this.wordsService.deleteWord(Number(id));
  }
}
