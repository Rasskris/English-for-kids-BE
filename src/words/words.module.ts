import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './word.entity';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';
import { FilesModule } from '../files';

@Module({
  imports: [TypeOrmModule.forFeature([Word]), FilesModule],
  controllers: [WordsController],
  providers: [WordsService],
})
export class WordsModule {}
