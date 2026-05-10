import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserMapper } from './mappers/user.mapper';
import { UpdateMeDto } from './dto/update-me.dto';
import { UserRole } from './enums/user-role.enum';

describe('UsersController', () => {
  let controller: UsersController;

  const usersServiceMock = {
    findById: jest.fn(),
    update: jest.fn(),
    deactivate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    jest.clearAllMocks();
  });

  describe('getMe', () => {
    it('should return current user info', async () => {
      const authUser = {
        userId: 'user-1',
        email: 'test@example.com',
        role: UserRole.MERCHANT,
        isActive: true,
      };

      const userEntity = {
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const response = {
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.MERCHANT,
        isActive: true,
      };

      usersServiceMock.findById.mockResolvedValue(userEntity);

      const mapperSpy = jest
        .spyOn(UserMapper, 'toResponse')
        .mockReturnValue(response);

      const result = await controller.getMe(authUser);

      expect(usersServiceMock.findById).toHaveBeenCalledWith('user-1');
      expect(mapperSpy).toHaveBeenCalledWith(userEntity);
      expect(result).toEqual(response);
    });
  });

  describe('updateMe', () => {
    it('should update current user profile and return mapped response', async () => {
      const authUser = {
        userId: 'user-1',
        email: 'test@example.com',
        role: UserRole.MERCHANT,
        isActive: true,
      };

      const dto: UpdateMeDto = {
        firstName: 'Jane',
        lastName: 'Doe',
      };

      const updatedUser = {
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
      };

      const response = {
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        role: UserRole.MERCHANT,
        isActive: true,
      };

      usersServiceMock.update.mockResolvedValue(updatedUser);

      const mapperSpy = jest
        .spyOn(UserMapper, 'toResponse')
        .mockReturnValue(response);

      const result = await controller.updateMe(authUser, dto);

      expect(usersServiceMock.update).toHaveBeenCalledWith('user-1', dto);
      expect(mapperSpy).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(response);
    });
  });

  describe('deactivateMe', () => {
    it('should deactivate current user account and return mapped response', async () => {
      const authUser = {
        userId: 'user-1',
        email: 'test@example.com',
        role: UserRole.MERCHANT,
        isActive: true,
      };

      const deactivatedUser = {
        id: 'user-1',
        email: 'test@example.com',
        role: UserRole.MERCHANT,
        isActive: false,
      };

      const response = {
        id: 'user-1',
        email: 'test@example.com',
        role: UserRole.MERCHANT,
        isActive: false,
      };

      usersServiceMock.deactivate.mockResolvedValue(deactivatedUser);

      const mapperSpy = jest
        .spyOn(UserMapper, 'toResponse')
        .mockReturnValue(response);

      const result = await controller.deactivateMe(authUser);

      expect(usersServiceMock.deactivate).toHaveBeenCalledWith('user-1');
      expect(mapperSpy).toHaveBeenCalledWith(deactivatedUser);
      expect(result).toEqual(response);
    });
  });
});
