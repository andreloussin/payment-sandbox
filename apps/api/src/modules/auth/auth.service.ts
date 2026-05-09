import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import type { RegisterDto } from './dto/register.dto';
import { UserRole } from '../users/enums/user-role.enum';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/jwt-payload.type';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(
    dto: RegisterDto,
  ): Promise<{ user: UserDocument; access_token: string }> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new BadRequestException('User already exists');

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      email: dto.email,
      password: hashed,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      role: UserRole.MERCHANT,
    });

    return {
      user: user,
      access_token: this.generateTokens(user),
    };
  }

  async login(
    dto: LoginDto,
  ): Promise<{ user: UserDocument; access_token: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new BadRequestException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new BadRequestException('Invalid credentials');

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    return {
      user: user,
      access_token: this.generateTokens(user),
    };
  }

  private generateTokens(user: {
    id: string;
    email: string;
    role: UserRole;
    isActive: boolean;
  }): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };

    return this.jwtService.sign(payload);
  }
}
