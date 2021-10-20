import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from 'src/categories';
import { Word } from './word.entity';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';

@Module({
  imports: [
    forwardRef(() => CategoriesModule),
    TypeOrmModule.forFeature([Word]),
  ],
  controllers: [WordsController],
  providers: [WordsService],
})
export class WordsModule {}
