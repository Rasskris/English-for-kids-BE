import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  JWT,
  POSTGRES_ERROR_CODE,
  SALT_ROUNDS,
  SERVER_ERROR,
  USER_EMAIL_EXEPTION,
  USER_PASSWORD_EXEPTION,
} from '../constants';
import { TokenPayload } from '../interfaces';
import { UsersService } from '../users';
import { RegisterDto } from './dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(
      registrationData.password,
      SALT_ROUNDS,
    );

    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });

      return createdUser;
    } catch (error) {
      if (error?.code === POSTGRES_ERROR_CODE.UniqueViolation) {
        throw new HttpException(USER_EMAIL_EXEPTION, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassoword(plainTextPassword, user.password);

      return user;
    } catch (error) {
      throw new HttpException(USER_PASSWORD_EXEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  private async verifyPassoword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new HttpException(USER_PASSWORD_EXEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      JWT.EXPIRATION_TIME,
    )}`;
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
