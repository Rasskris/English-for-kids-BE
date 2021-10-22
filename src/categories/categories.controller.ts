import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
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
  async createCategory(@Body() categoryData: CreateCategoryDto) {
    return this.categoriesService.createCategory(categoryData);
  }

  @Patch(':id')
  async updateCategory(
    @Param() { id }: RequestParam,
    @Body() categoryData: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(Number(id), categoryData);
  }

  @Delete(':id')
  async deleteCategory(@Param() { id }: RequestParam) {
    return this.categoriesService.deleteCategory(Number(id));
  }
}
