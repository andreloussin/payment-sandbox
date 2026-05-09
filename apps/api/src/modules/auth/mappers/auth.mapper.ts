import { UserMapper } from '../../users/mappers/user.mapper';
import { UserDocument } from '../../users/schemas/user.schema';
import { AuthResponseDto } from '../dto/auth-response.dto';

export class AuthMapper {
  static toResponse(user: UserDocument, accessToken: string): AuthResponseDto {
    return {
      access_token: accessToken,
      user: UserMapper.toResponse(user),
    };
  }
}
