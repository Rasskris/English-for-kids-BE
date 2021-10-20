import { IsString, IsNotEmpty } from 'class-validator';

export class CreateWordDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  translation: string;

  image: string;
  audio: string;
}
