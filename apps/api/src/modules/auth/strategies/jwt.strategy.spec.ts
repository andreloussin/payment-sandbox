import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';
import { AppConfigService } from '../../../config/app-config.service';
import { UserRole } from '../../../modules/users/enums/user-role.enum';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const configMock = {
    jwtAccessSecret: 'test-secret',
  } as unknown as AppConfigService;

  beforeEach(() => {
    strategy = new JwtStrategy(configMock);
  });

  describe('validate', () => {
    it('should return authenticated user when payload is valid', () => {
      const payload = {
        sub: 'user-id',
        email: 'test@example.com',
        role: UserRole.MERCHANT,
        isActive: true,
      };

      const result = strategy.validate(payload);

      expect(result).toEqual({
        userId: 'user-id',
        email: 'test@example.com',
        role: UserRole.MERCHANT,
        isActive: true,
      });
    });

    it('should throw UnauthorizedException when user is inactive', () => {
      const payload = {
        sub: 'user-id',
        email: 'test@example.com',
        role: UserRole.MERCHANT,
        isActive: false,
      };

      expect(() => strategy.validate(payload)).toThrow(UnauthorizedException);
    });
  });
});
