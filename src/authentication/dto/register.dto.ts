import { ROLE } from '../../constants';

export class RegisterDto {
  name: string;
  email: string;
  password: string;
  role: ROLE;
}
