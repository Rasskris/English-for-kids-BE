import { IsString, IsNotEmpty } from 'class-validator';
import { ObjectWithIdDto } from './objectWithId.dto';

export class CreateWordDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  translation: string;

  category: ObjectWithIdDto;
}
