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
import { CATEGORY_FIELD_NAME } from 'src/constants';
import { CategoryFiles } from 'src/interfaces/categoryFiles.interface';
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
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: CATEGORY_FIELD_NAME.COVER_IMAGE, maxCount: 1 },
      { name: CATEGORY_FIELD_NAME.ICON, maxCount: 1 },
    ]),
  )
  async createCategory(@Body() categoryData: CreateCategoryDto, @UploadedFiles() files?: CategoryFiles) {
    return this.categoriesService.createCategory(categoryData, files);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: CATEGORY_FIELD_NAME.COVER_IMAGE, maxCount: 1 },
      { name: CATEGORY_FIELD_NAME.ICON, maxCount: 1 },
    ]),
  )
  async updateCategory(
    @Param() { id }: RequestParam,
    @Body() categoryData: UpdateCategoryDto,
    @UploadedFiles() files?: CategoryFiles,
  ) {
    return this.categoriesService.updateCategory(Number(id), categoryData, files);
  }

  @Delete(':id')
  async deleteCategory(@Param() { id }: RequestParam) {
    return this.categoriesService.deleteCategory(Number(id));
  }
}
