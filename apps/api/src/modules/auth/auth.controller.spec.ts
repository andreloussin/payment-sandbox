import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthMapper } from './mappers/auth.mapper';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../users/enums/user-role.enum';

describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should call auth service and map response', async () => {
      const dto: RegisterDto = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      const user = {
        id: 'user-1',
        email: dto.email,
        role: UserRole.MERCHANT,
        isActive: true,
      };

      authServiceMock.register.mockResolvedValue({
        user,
        access_token: 'access-token',
      });

      const mapperSpy = jest.spyOn(AuthMapper, 'toResponse').mockReturnValue({
        user,
        access_token: 'access-token',
      });

      const result = await controller.register(dto);

      expect(authServiceMock.register).toHaveBeenCalledWith(dto);
      expect(mapperSpy).toHaveBeenCalledWith(user, 'access-token');
      expect(result).toEqual({
        user,
        access_token: 'access-token',
      });
    });
  });

  describe('login', () => {
    it('should call auth service and map response', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const user = {
        id: 'user-1',
        email: dto.email,
        role: UserRole.MERCHANT,
        isActive: true,
      };

      authServiceMock.login.mockResolvedValue({
        user,
        access_token: 'access-token',
      });

      const mapperSpy = jest.spyOn(AuthMapper, 'toResponse').mockReturnValue({
        user,
        access_token: 'access-token',
      });

      const result = await controller.login(dto);

      expect(authServiceMock.login).toHaveBeenCalledWith(dto);
      expect(mapperSpy).toHaveBeenCalledWith(user, 'access-token');
      expect(result).toEqual({
        user,
        access_token: 'access-token',
      });
    });
  });
});
