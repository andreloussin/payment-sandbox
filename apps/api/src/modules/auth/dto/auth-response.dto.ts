import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';

export class AuthResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
