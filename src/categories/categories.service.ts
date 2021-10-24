import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ENTITY_NAME, QUERY_NAME } from '../constants';
import { EntityNotFoudException } from '../exeptions';
import { Category } from './category.entity';
import { File, FilesService } from '../files';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

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

  async createCategory(categoryData: CreateCategoryDto, { buffer, originalname }: Express.Multer.File) {
    const image = await this.filesService.uploadFile(buffer, originalname);
    const newCategory = await this.categoriesRepository.create({
      ...categoryData,
      image,
    });
    const savedCategory = await this.categoriesRepository.save(newCategory);

    return savedCategory;
  }

  async updateCategory(id: number, categoryData: UpdateCategoryDto, file?: Express.Multer.File) {
    const category = await this.categoriesRepository.findOne(id);

    let image: File | null;

    if (file) {
      await this.categoriesRepository.update(id, {
        ...category,
        image: null,
      });
      await this.filesService.deleteFile(category.image.id);
      image = await this.filesService.uploadFile(file.buffer, file.originalname);
      category.image = image;
    }

    await this.categoriesRepository.update(id, {
      ...category,
      ...categoryData,
    });
    const updatedCategory = await this.categoriesRepository.findOne(id);

    return updatedCategory;
  }

  async deleteCategory(id: number) {
    const { image } = await this.categoriesRepository.findOne(id);
    const { affected } = await this.categoriesRepository.delete(id);

    if (affected) {
      this.filesService.deleteFile(image.id);

      return id;
    }
    throw new EntityNotFoudException(ENTITY_NAME.CATEGORY, QUERY_NAME.ID, id);
  }
}
