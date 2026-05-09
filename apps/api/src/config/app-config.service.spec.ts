import { ConfigService } from '@nestjs/config';
import { AppConfigService } from './app-config.service';
import { Environment } from './environment.enum';

describe('AppConfigService', () => {
  let service: AppConfigService;
  let configService: Partial<ConfigService>;

  beforeEach(() => {
    configService = {
      get: jest.fn(),
      getOrThrow: jest.fn((key: string) => {
        const values: Record<string, string> = {
          JWT_ACCESS_SECRET: 'jwt-secret',
          MONGO_URI: 'mongodb://localhost:27017/test',
        };

        return values[key];
      }),
    };

    service = new AppConfigService(configService as ConfigService);
  });

  describe('nodeEnv', () => {
    it('should return Development by default', () => {
      (configService.get as jest.Mock).mockReturnValue(undefined);

      expect(service.nodeEnv).toBe(Environment.Development);
    });

    it('should return valid environment', () => {
      (configService.get as jest.Mock).mockReturnValue('production');

      expect(service.nodeEnv).toBe(Environment.Production);
    });

    it('should fallback to Development if invalid value', () => {
      (configService.get as jest.Mock).mockReturnValue('invalid_env');

      expect(service.nodeEnv).toBe(Environment.Development);
    });
  });

  describe('flags', () => {
    it('should detect development', () => {
      (configService.get as jest.Mock).mockReturnValue('development');

      expect(service.isDev()).toBe(true);
      expect(service.isProd()).toBe(false);
      expect(service.isTest()).toBe(false);
    });

    it('should detect production', () => {
      (configService.get as jest.Mock).mockReturnValue('production');

      expect(service.isProd()).toBe(true);
    });

    it('should detect test', () => {
      (configService.get as jest.Mock).mockReturnValue('test');

      expect(service.isTest()).toBe(true);
    });
  });

  describe('secrets', () => {
    it('should return JWT access secret', () => {
      expect(service.jwtAccessSecret).toBe('jwt-secret');
    });

    it('should return mongo uri', () => {
      expect(service.mongoUri).toBe('mongodb://localhost:27017/test');
    });
  });
});
