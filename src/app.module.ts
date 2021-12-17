import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DataBaseModule } from './database';
import { AuthenticationModule } from './authentication';
import { UsersModule } from './users';
import { CategoriesModule } from './categories';
import { WordsModule } from './words';
import { FilesModule } from './files';

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
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
      }),
    }),
    DataBaseModule,
    AuthenticationModule,
    UsersModule,
    FilesModule,
    CategoriesModule,
    WordsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
