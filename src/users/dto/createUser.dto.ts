import { ROLE } from 'src/constants';

export class CreateUserDto {
  email: string;
  name: string;
  password: string;
  role: ROLE;
}
