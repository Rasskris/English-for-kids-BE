import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthenticationService } from '../authentication.service';
import { User, UsersService } from '../../users';
import { mokedConfigService, mockedJwtService } from '../../utils/mocks';

const USER_ID = 1;

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthenticationService,
        {
          provide: ConfigService,
          useValue: mokedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    }).compile();

    authenticationService = await moduleRef.get(AuthenticationService);
  });

  describe('Сreating a cookie', () => {
    it('should return a string', () => {
      const cookie = authenticationService.getCookieWithJwtToken(USER_ID);
      expect(typeof cookie).toEqual('string');
    });
  });
});
