import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityNotFoudException } from '../exeptions';
import { Category } from './category.entity';
import { File, FilesService } from '../files';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { CategoryFiles } from '../interfaces';
import { MulterFile } from '../types';
import {
  FIELD_NAMES,
  CATEGORY_FIELD_NAME,
  ENTITY_NAME,
  QUERY_NAME,
  CATEGORY_NAME_EXEPTION,
  POSTGRES_ERROR_CODE,
  SERVER_ERROR,
} from '../constants';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    private readonly filesService: FilesService,
  ) {}

  async getAllCategories() {
    return this.categoriesRepository.find();
  }

  async getCategory(id: number) {
    const category = await this.categoriesRepository.findOne({ id }, { relations: ['words'] });

    if (category) {
      return category;
    }
    throw new EntityNotFoudException(ENTITY_NAME.CATEGORY, QUERY_NAME.ID, id);
  }

  async createCategory(categoryData: CreateCategoryDto, categoryFiles: CategoryFiles) {
    try {
      const { coverImage: coverImageFile, icon: iconFile } = categoryFiles;
      const coverImage = await this.addCategoryFile(coverImageFile);
      const icon = await this.addCategoryFile(iconFile);

      const newCategory = await this.categoriesRepository.create({
        ...categoryData,
        coverImage,
        icon,
      });
      const savedCategory = await this.categoriesRepository.save(newCategory);

      return savedCategory;
    } catch (error) {
      if (error?.code === POSTGRES_ERROR_CODE.UniqueViolation) {
        throw new HttpException(CATEGORY_NAME_EXEPTION, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateCategory(id: number, categoryData: UpdateCategoryDto, categoryFiles?: CategoryFiles) {
    try {
      const { coverImage: coverImageFile, icon: iconFile } = categoryFiles;
      const category = await this.categoriesRepository.findOne(id);

      let coverImage: File | null;
      let icon: File | null;

      if (coverImageFile) {
        await this.deleteCategoryFile(category, CATEGORY_FIELD_NAME.COVER_IMAGE);
        coverImage = await this.addCategoryFile(coverImageFile);
        category.coverImage = coverImage;
      }
      if (iconFile) {
        await this.deleteCategoryFile(category, CATEGORY_FIELD_NAME.ICON);
        icon = await this.addCategoryFile(iconFile);
        category.icon = icon;
      }

      await this.categoriesRepository.update(id, {
        ...categoryData,
        coverImage: category.coverImage,
        icon: category.icon,
      });
      const updatedCategory = await this.categoriesRepository.findOne(id);

      return updatedCategory;
    } catch (error) {
      if (error?.code === POSTGRES_ERROR_CODE.UniqueViolation) {
        throw new HttpException(CATEGORY_NAME_EXEPTION, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteCategory(id: number) {
    const category = await this.categoriesRepository.findOne(id);
    const { affected } = await this.categoriesRepository.delete(id);

    if (affected) {
      FIELD_NAMES.CATEGORY.forEach(
        async (fieldName: CATEGORY_FIELD_NAME) => await this.filesService.deleteFile(category[fieldName].id),
      );

      return id;
    }
    throw new EntityNotFoudException(ENTITY_NAME.CATEGORY, QUERY_NAME.ID, id);
  }

  async addCategoryFile(categoryFile: MulterFile) {
    console.log('addCategoryFile >>', categoryFile);
    const { buffer, originalname } = categoryFile[0];
    const file = await this.filesService.uploadFile(buffer, originalname);

    return file;
  }

  async deleteCategoryFile(category: Category, fieldName: CATEGORY_FIELD_NAME) {
    await this.categoriesRepository.update(category.id, {
      ...category,
      [fieldName]: null,
    });

    await this.filesService.deleteFile(category[fieldName].id);
  }
}
