import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { App } from 'supertest/types';
import { ApiResponse } from '../src/common/dto/api-response.dto';
import { HealthResponseDto } from '../src/modules/health/dto/health-response.dto';
import { ApiResponseInterceptor } from '../src/common/interceptors/api-response.interceptor';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api/v1');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());

    app.useGlobalInterceptors(new ApiResponseInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET)', async () => {
    const response = await request(app.getHttpServer() as App)
      .get('/api/v1/health')
      .expect(200);

    const body = response.body as ApiResponse<HealthResponseDto>;

    expect(body.success).toBe(true);
    expect(body.message).toBe('success');

    expect(body.data).toBeDefined();
    expect(body.data.status).toBe('ok');

    expect(body.error).toBeNull();

    expect(body.meta).toBeDefined();
    expect(body.meta.timestamp).toBeDefined();
    expect(body.meta.path).toBe('/api/v1/health');
    expect(body.meta.method).toBe('GET');
  });
});
