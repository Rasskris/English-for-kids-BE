export const USER_EMAIL_EXEPTION = 'User with that email already exists';

export const CATEGORY_NAME_EXEPTION = 'Category with that name already exists';

export const USER_PASSWORD_EXEPTION = 'Wrong credentials provided';

export const USER_ID_EXEPTION = 'User with this id does not exist';

export const SERVER_ERROR = 'Something went wrong';

export const SALT_ROUNDS = 10;

export const COUNT_SECONDS_IN_HOUR = 3600;

export const JWT = {
  SECRET: 'JWT_SECRET',
  EXPIRATION_TIME: 'JWT_EXPIRATION_TIME',
};

export const AWS = {
  REGION: 'AWS_REGION',
  ACCESS_KEY_ID: 'AWS_ACCESS_KEY_ID',
  SECRET_ACCESS_KEY: 'AWS_SECRET_ACCESS_KEY',
  PUBLIC_BUCKET_NAME: 'AWS_PUBLIC_BUCKET_NAME',
};

export const FIELD_NAMES = {
  CATEGORY: ['coverImage', 'icon'],
  WORD: ['image', 'audio'],
};

export enum POSTGRES_ERROR_CODE {
  UniqueViolation = '23505',
}

export enum ENTITY_NAME {
  USER = 'User',
  WORD = 'Word',
  CATEGORY = 'Category',
}

export enum QUERY_NAME {
  ID = 'id',
  EMAIL = 'email',
}

export enum WORD_FIELD_NAME {
  IMAGE = 'image',
  AUDIO = 'audio',
}

export enum CATEGORY_FIELD_NAME {
  COVER_IMAGE = 'coverImage',
  ICON = 'icon',
}

export enum ROLE {
  ADMIN = 'admin',
  USER = 'user',
}
