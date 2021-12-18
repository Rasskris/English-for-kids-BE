import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { config } from 'aws-sdk';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AWS } from './constants';
import { CustomLogger } from './logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configservice = app.get(ConfigService);

  app.useLogger(app.get(CustomLogger));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser());

  config.update({
    accessKeyId: configservice.get(AWS.ACCESS_KEY_ID),
    secretAccessKey: configservice.get(AWS.SECRET_ACCESS_KEY),
    region: configservice.get(AWS.REGION),
  });

  app.enableCors({
    credentials: true,
    origin: configservice.get('FRONTEND_URL'),
  });
  await app.listen(configservice.get('PORT'));
}
bootstrap();
