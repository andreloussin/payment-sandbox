import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

import { UsersService } from './users.service';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateMeDto } from './dto/update-me.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: jest.Mocked<Partial<Model<any>>>;

  beforeEach(async () => {
    userModel = {
      findById: jest.fn(),
      findOne: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      const payload = {
        email: 'test@example.com',
        password: 'hashed-password',
        firstName: 'Test',
      };

      const savedUser = { ...payload, _id: 'user-id' };
      const saveMock = jest.fn().mockResolvedValue(savedUser);
      const userModelMock = jest.fn().mockImplementation(() => ({
        save: saveMock,
      })) as unknown as Model<UserDocument>;

      const createService = new UsersService(userModelMock);

      const result = await createService.create(payload);

      expect(userModelMock).toHaveBeenCalledWith(payload);
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual(savedUser);
    });
  });

  describe('findById', () => {
    it('should return user without password', async () => {
      const user = { _id: 'user-id', email: 'test@example.com' };
      const select = jest.fn().mockResolvedValue(user);
      (userModel.findById as jest.Mock).mockReturnValue({ select } as any);

      const result = await service.findById('user-id');

      expect(userModel.findById).toHaveBeenCalledWith('user-id');
      expect(select).toHaveBeenCalledWith('-password');
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const select = jest.fn().mockResolvedValue(null);
      (userModel.findById as jest.Mock).mockReturnValue({ select } as any);

      await expect(service.findById('missing-id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      await expect(service.findById('missing-id')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('findByEmail', () => {
    it('should trim and lowercase email before querying', async () => {
      const user = { _id: 'user-id', email: 'test@example.com' };
      (userModel.findOne as jest.Mock).mockResolvedValue(user);

      const result = await service.findByEmail('  TEST@EXAMPLE.COM  ');

      expect(userModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update user profile and return updated user without password', async () => {
      const dto: UpdateMeDto = {
        firstName: 'New',
        lastName: 'Name',
        phone: '22990000000',
      };

      const updatedUser = {
        _id: 'user-id',
        ...dto,
      };

      const select = jest.fn().mockResolvedValue(updatedUser);
      (userModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        select,
      } as any);

      const result = await service.update('user-id', dto);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user-id',
        { $set: dto },
        {
          new: true,
          runValidators: true,
        },
      );
      expect(select).toHaveBeenCalledWith('-password');
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException when user is missing', async () => {
      const select = jest.fn().mockResolvedValue(null);
      (userModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        select,
      } as any);

      await expect(service.update('missing-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deactivate', () => {
    it('should deactivate a user and set deactivatedAt', async () => {
      const deactivatedUser = {
        _id: 'user-id',
        isActive: false,
        deactivatedAt: new Date(),
      };

      const select = jest.fn().mockResolvedValue(deactivatedUser);
      (userModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        select,
      } as any);

      const result = await service.deactivate('user-id');

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user-id',
        {
          $set: {
            isActive: false,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            deactivatedAt: expect.any(Date),
          },
        },
        { new: true },
      );

      expect(select).toHaveBeenCalledWith('-password');
      expect(result).toEqual(deactivatedUser);
    });

    it('should throw NotFoundException when user is missing', async () => {
      const select = jest.fn().mockResolvedValue(null);
      (userModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        select,
      } as any);

      await expect(service.deactivate('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all users without passwords', async () => {
      const users = [{ _id: '1' }, { _id: '2' }];
      const select = jest.fn().mockResolvedValue(users);
      (userModel.find as jest.Mock).mockReturnValue({ select } as any);

      const result = await service.findAll();

      expect(userModel.find).toHaveBeenCalledTimes(1);
      expect(select).toHaveBeenCalledWith('-password');
      expect(result).toEqual(users);
    });
  });
});
