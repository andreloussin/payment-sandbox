import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { UsersService } from './users.service';

import { UpdateMeDto } from './dto/update-me.dto';
import type { AuthenticatedUser } from '../auth/types/auth-request.type';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserMapper } from './mappers/user.mapper';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiOkResponseData } from 'src/common/swagger/api-response.decorator';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponseData(UserResponseDto, {
    description: 'Get current user info successfully',
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserResponseDto> {
    return UserMapper.toResponse(await this.usersService.findById(user.userId));
  }

  @ApiOkResponseData(UserResponseDto, {
    description: 'Update current user info successfully ',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateMeDto,
  ): Promise<UserResponseDto> {
    return UserMapper.toResponse(
      await this.usersService.update(user.userId, dto),
    );
  }

  @ApiOkResponseData(UserResponseDto, {
    description: 'Deactivate current user account successfully',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('me/deactivate')
  async deactivateMe(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserResponseDto> {
    return UserMapper.toResponse(
      await this.usersService.deactivate(user.userId),
    );
  }
}
