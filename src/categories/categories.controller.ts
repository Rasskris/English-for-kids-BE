import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestParam } from '../interfaces';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Get(':id')
  async getCategory(@Param() { id }: RequestParam) {
    return this.categoriesService.getCategory(Number(id));
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createCategory(@Body() categoryData: CreateCategoryDto, @UploadedFile() file: Express.Multer.File) {
    return this.categoriesService.createCategory(categoryData, file);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateCategory(
    @Param() { id }: RequestParam,
    @Body() categoryData: UpdateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.categoriesService.updateCategory(Number(id), categoryData, file);
  }

  @Delete(':id')
  async deleteCategory(@Param() { id }: RequestParam) {
    return this.categoriesService.deleteCategory(Number(id));
  }
}
