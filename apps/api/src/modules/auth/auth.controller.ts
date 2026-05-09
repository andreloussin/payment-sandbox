import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthMapper } from './mappers/auth.mapper';
import { ApiTags } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ApiOkResponseData } from '../../common/swagger/api-response.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponseData(AuthResponseDto, {
    description: 'User registered successfully',
  })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto);
    return AuthMapper.toResponse(result.user, result.access_token);
  }

  @ApiOkResponseData(AuthResponseDto, {
    description: 'User logged in successfully',
  })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return AuthMapper.toResponse(result.user, result.access_token);
  }
}
