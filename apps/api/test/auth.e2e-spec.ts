import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { App } from 'supertest/types';
import { ApiResponse } from '../src/common/dto/api-response.dto';
import { AuthResponseDto } from '../src/modules/auth/dto/auth-response.dto';
import { createE2ETestApp } from './utils/e2e-bootstrap';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const baseUrl = '/api/v1/auth';

  const uniqueEmail = () => `john.doe.${Date.now()}@example.com`;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';

    const result = await createE2ETestApp();

    app = result.app;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a user and return auth response', async () => {
      const email = uniqueEmail();

      const response = await request(app.getHttpServer() as App)
        .post(`${baseUrl}/register`)
        .send({
          email,
          password: 'Password123!',
          firstName: 'John',
          lastName: 'Doe',
        })
        .expect(201);

      const body = response.body as ApiResponse<AuthResponseDto>;

      expect(body).toBeDefined();
      expect(body.data).toBeDefined();
      expect(body.data.access_token).toBeDefined();
      expect(body.data.user).toBeDefined();
      expect(body.data.user.email).toBe(email);
    });

    it('should reject duplicate email', async () => {
      const email = uniqueEmail();

      await request(app.getHttpServer() as App)
        .post(`${baseUrl}/register`)
        .send({
          email,
          password: 'Password123!',
          firstName: 'John',
          lastName: 'Doe',
        })
        .expect(201);

      const response = await request(app.getHttpServer() as App)
        .post(`${baseUrl}/register`)
        .send({
          email,
          password: 'Password123!',
          firstName: 'Jane',
          lastName: 'Doe',
        })
        .expect(400);

      const body = response.body as ApiResponse<AuthResponseDto>;

      expect(body).toBeDefined();
      expect(body.message).toBeDefined();
    });

    it('should reject invalid payload', async () => {
      const response = await request(app.getHttpServer() as App)
        .post(`${baseUrl}/register`)
        .send({
          email: 'invalid-email',
          password: '123',
        })
        .expect(400);

      expect(response.body).toBeDefined();
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully and return auth response', async () => {
      const email = uniqueEmail();

      await request(app.getHttpServer() as App)
        .post(`${baseUrl}/register`)
        .send({
          email,
          password: 'Password123!',
          firstName: 'John',
          lastName: 'Doe',
        })
        .expect(201);

      const response = await request(app.getHttpServer() as App)
        .post(`${baseUrl}/login`)
        .send({
          email,
          password: 'Password123!',
        })
        .expect(201);

      const body = response.body as ApiResponse<AuthResponseDto>;

      expect(body).toBeDefined();
      expect(body.data).toBeDefined();
      expect(body.data.access_token).toBeDefined();
      expect(body.data.user).toBeDefined();
      expect(body.data.user.email).toBe(email);
    });

    it('should reject invalid password', async () => {
      const email = uniqueEmail();

      await request(app.getHttpServer() as App)
        .post(`${baseUrl}/register`)
        .send({
          email,
          password: 'Password123!',
          firstName: 'John',
          lastName: 'Doe',
        })
        .expect(201);

      const response = await request(app.getHttpServer() as App)
        .post(`${baseUrl}/login`)
        .send({
          email,
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body).toBeDefined();
    });

    it('should reject unknown user', async () => {
      const response = await request(app.getHttpServer() as App)
        .post(`${baseUrl}/login`)
        .send({
          email: uniqueEmail(),
          password: 'Password123!',
        })
        .expect(401);

      expect(response.body).toBeDefined();
    });

    it('should reject deactivated account', async () => {
      const email = uniqueEmail();

      const registerResponse = await request(app.getHttpServer() as App)
        .post(`${baseUrl}/register`)
        .send({
          email,
          password: 'Password123!',
          firstName: 'John',
          lastName: 'Doe',
        })
        .expect(201);

      const accessToken = (
        registerResponse.body as ApiResponse<AuthResponseDto>
      ).data.access_token;

      await request(app.getHttpServer() as App)
        .patch('/api/v1/users/me/deactivate')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const response = await request(app.getHttpServer() as App)
        .post(`${baseUrl}/login`)
        .send({
          email,
          password: 'Password123!',
        })
        .expect(403);

      const body = response.body as ApiResponse<AuthResponseDto>;

      expect(body).toBeDefined();
      expect(body.message).toBeDefined();
    });
  });
});
