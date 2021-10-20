import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DataBaseModule } from './database';
import { AuthenticationModule } from './authentication';
import { UsersModule } from './users';
import { CategoriesModule } from './categories';
import { WordsModule } from './words';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    DataBaseModule,
    AuthenticationModule,
    UsersModule,
    CategoriesModule,
    WordsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
