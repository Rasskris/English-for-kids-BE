import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CATEGORY_ID_EXEPTION } from 'src/constants';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async getAllCategories() {
    return this.categoriesRepository.find();
  }

  async getCategory(id: number) {
    const category = await this.categoriesRepository.findOne({ id });

    if (category) {
      return category;
    }
    throw new HttpException(CATEGORY_ID_EXEPTION, HttpStatus.NOT_FOUND);
  }

  async createCategory(categoryData: CreateCategoryDto) {
    const newCategory = await this.categoriesRepository.create(categoryData);
    const savedCategory = await this.categoriesRepository.save(newCategory);

    return savedCategory;
  }

  async updateCategory(id: number, categoryData: UpdateCategoryDto) {
    await this.categoriesRepository.update(id, categoryData);
    const updatedCategory = this.getCategory(id);

    return updatedCategory;
  }

  async deleteCategory(id: number) {
    const { affected } = await this.categoriesRepository.delete(id);

    if (affected) {
      return id;
    }
    throw new HttpException(CATEGORY_ID_EXEPTION, HttpStatus.NOT_FOUND);
  }
}
