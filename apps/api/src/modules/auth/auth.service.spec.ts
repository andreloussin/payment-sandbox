import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../users/enums/user-role.enum';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;

  const usersServiceMock = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new merchant and return an access token', async () => {
      const dto: RegisterDto = {
        email: 'merchant@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        phone: '22990000000',
      };

      const createdUser = {
        id: 'user-id',
        email: dto.email,
        password: 'hashed-password',
        role: UserRole.MERCHANT,
        isActive: true,
      };

      usersServiceMock.findByEmail.mockResolvedValueOnce(null);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashed-password');
      usersServiceMock.create.mockResolvedValueOnce(createdUser);
      jwtServiceMock.sign.mockReturnValueOnce('access-token');

      const result = await service.register(dto);

      expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(usersServiceMock.create).toHaveBeenCalledWith({
        email: dto.email,
        password: 'hashed-password',
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: UserRole.MERCHANT,
      });
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        sub: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
        isActive: createdUser.isActive,
      });
      expect(result).toEqual({
        user: createdUser,
        access_token: 'access-token',
      });
    });

    it('should throw if user already exists', async () => {
      const dto: RegisterDto = {
        email: 'merchant@example.com',
        password: 'Password123!',
      };

      usersServiceMock.findByEmail.mockResolvedValueOnce({
        id: 'existing-user',
        email: dto.email,
      });

      const promise = service.register(dto);

      await expect(promise).rejects.toBeInstanceOf(BadRequestException);
      await expect(promise).rejects.toThrow('User already exists');

      expect(usersServiceMock.create).not.toHaveBeenCalled();
      expect(jwtServiceMock.sign).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const dto: LoginDto = {
        email: 'merchant@example.com',
        password: 'Password123!',
      };

      const user = {
        id: 'user-id',
        email: dto.email,
        password: 'hashed-password',
        role: UserRole.MERCHANT,
        isActive: true,
      };

      usersServiceMock.findByEmail.mockResolvedValueOnce(user);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      jwtServiceMock.sign.mockReturnValueOnce('access-token');

      const result = await service.login(dto);

      expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(dto.password, user.password);
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      });
      expect(result).toEqual({
        user,
        access_token: 'access-token',
      });
    });

    it('should throw if user is not found', async () => {
      const dto: LoginDto = {
        email: 'missing@example.com',
        password: 'Password123!',
      };

      usersServiceMock.findByEmail.mockResolvedValueOnce(null);

      const promise = service.login(dto);

      await expect(promise).rejects.toBeInstanceOf(UnauthorizedException);
      await expect(promise).rejects.toThrow('Invalid credentials');

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwtServiceMock.sign).not.toHaveBeenCalled();
    });

    it('should throw if password is invalid', async () => {
      const dto: LoginDto = {
        email: 'merchant@example.com',
        password: 'WrongPassword!',
      };

      const user = {
        id: 'user-id',
        email: dto.email,
        password: 'hashed-password',
        role: UserRole.MERCHANT,
        isActive: true,
      };

      usersServiceMock.findByEmail.mockResolvedValueOnce(user);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const promise = service.login(dto);

      await expect(promise).rejects.toBeInstanceOf(UnauthorizedException);
      await expect(promise).rejects.toThrow('Invalid password');

      expect(jwtServiceMock.sign).not.toHaveBeenCalled();
    });

    it('should throw if account is deactivated', async () => {
      const dto: LoginDto = {
        email: 'merchant@example.com',
        password: 'Password123!',
      };

      const user = {
        id: 'user-id',
        email: dto.email,
        password: 'hashed-password',
        role: UserRole.MERCHANT,
        isActive: false,
      };

      usersServiceMock.findByEmail.mockResolvedValueOnce(user);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const promise = service.login(dto);

      await expect(promise).rejects.toBeInstanceOf(ForbiddenException);
      await expect(promise).rejects.toThrow('Account is deactivated');

      expect(jwtServiceMock.sign).not.toHaveBeenCalled();
    });
  });
});
