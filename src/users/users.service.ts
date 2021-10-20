import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ENTITY_NAME, QUERY_NAME } from '../constants';
import { CreateUserDto } from './dto';
import { EntityNotFoudException } from '../exeptions';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });

    if (user) {
      return user;
    }
    throw new EntityNotFoudException(ENTITY_NAME.USER, QUERY_NAME.EMAIL, email);
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new EntityNotFoudException(ENTITY_NAME.USER, QUERY_NAME.ID, id);
  }

  async create(userData: CreateUserDto) {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);

    return newUser;
  }
}
