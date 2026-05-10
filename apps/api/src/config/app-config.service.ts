import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from './environment.enum';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  private get<T>(key: string): T {
    return this.configService.getOrThrow<T>(key);
  }

  get nodeEnv(): Environment {
    const value = this.configService.get<string>('NODE_ENV');

    if (!value) return Environment.Development;

    if (!Object.values(Environment).includes(value as Environment)) {
      return Environment.Development;
    }

    return value as Environment;
  }

  isDev(): boolean {
    return this.nodeEnv === Environment.Development;
  }

  isProd(): boolean {
    return this.nodeEnv === Environment.Production;
  }

  isTest(): boolean {
    return this.nodeEnv === Environment.Test;
  }

  get jwtAccessSecret(): string {
    return this.get<string>('JWT_ACCESS_SECRET');
  }

  get mongoUri(): string {
    return this.get<string>('MONGO_URI');
  }
}
