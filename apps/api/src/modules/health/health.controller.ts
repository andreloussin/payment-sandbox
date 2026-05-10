import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiOkResponseData } from '../../common/swagger/api-response.decorator';
import { HealthResponseDto } from './dto/health-response.dto';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @ApiOkResponseData(HealthResponseDto, {
    description: 'User registered successfully',
  })
  @Get()
  check() {
    return {
      status: 'ok',
    };
  }
}
