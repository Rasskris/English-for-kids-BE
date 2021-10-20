import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ENTITY_NAME, QUERY_NAME } from '../constants';
import { EntityNotFoudException } from '../exeptions';
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
    const category = await this.categoriesRepository.findOne(
      { id },
      { relations: ['words'] },
    );

    if (category) {
      return category;
    }
    throw new EntityNotFoudException(ENTITY_NAME.CATEGORY, QUERY_NAME.ID, id);
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
    throw new EntityNotFoudException(ENTITY_NAME.CATEGORY, QUERY_NAME.ID, id);
  }
}
