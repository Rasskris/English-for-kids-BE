import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UsersService } from '..';

const TEST_EMAIL = 'test@test.com';

const TEST_USER = {
  name: 'test',
  email: TEST_EMAIL,
  password: 'test',
};

describe('UsersService', () => {
  let usersService: UsersService;
  let findOne: jest.Mock;
  let create: jest.Mock;
  let save: jest.Mock;

  beforeEach(async () => {
    findOne = jest.fn();
    create = jest.fn();
    save = jest.fn();

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create,
            save,
            findOne,
          },
        },
      ],
    }).compile();

    usersService = await moduleRef.get<UsersService>(UsersService);
  });

  describe('create user', () => {
    beforeEach(() => {
      create.mockReturnValue(TEST_USER);
    });

    it('should return created user', async () => {
      const createdUser = await usersService.create(TEST_USER);
      expect(createdUser).toEqual(TEST_USER);
    });
  });

  describe('find user by email', () => {
    let user: User;

    describe('matched user', () => {
      beforeEach(() => {
        user = new User();
        findOne.mockReturnValue(Promise.resolve(user));
      });

      it('should return user', async () => {
        const fetchedUser = await usersService.getByEmail(TEST_EMAIL);
        expect(fetchedUser).toEqual(user);
      });
    });

    describe('not matched user', () => {
      beforeEach(() => {
        findOne.mockReturnValue(undefined);
      });

      it('should throw an error', async () => {
        await expect(usersService.getByEmail(TEST_EMAIL)).rejects.toThrow();
      });
    });
  });
});
