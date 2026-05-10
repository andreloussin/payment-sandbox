import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.getOrThrow<string>('DATABASE_URL');

        const nodeEnv = configService.get<string>('NODE_ENV');

        // sécurité anti-erreur grave
        if (nodeEnv === 'test' && !uri.includes('test')) {
          throw new Error(
            `❌ Unsafe Mongo URI in test environment: ${uri}. Refusing to run tests on non-test DB`,
          );
        }

        return { uri };
      },
    }),
  ],
})
export class DatabaseModule {}
