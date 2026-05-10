import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { ApiResponse } from '../src/common/dto/api-response.dto';
import { AuthResponseDto } from '../src/modules/auth/dto/auth-response.dto';
import { App } from 'supertest/types';
import { UserResponseDto } from '../src/modules/users/dto/user-response.dto';
import { createE2ETestApp } from './utils/e2e-bootstrap';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  const httpServer = () => app.getHttpServer() as App;

  const baseUrl = '/api/v1/users';
  const authUrl = '/api/v1/auth';

  const uniqueEmail = () => `user.test.${Date.now()}@example.com`;

  const registerUser = async () => {
    const email = uniqueEmail();
    const password = 'Password123!';

    const registerResponse = await request(httpServer())
      .post(`${authUrl}/register`)
      .send({
        email,
        password,
        firstName: 'John',
        lastName: 'Doe',
      })
      .expect(201);

    const body = registerResponse.body as ApiResponse<AuthResponseDto>;

    return {
      email,
      password,
      token: body.data.access_token,
      user: body.data.user,
    };
  };

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';

    const result = await createE2ETestApp();

    app = result.app;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /users/me', () => {
    it('should return the current user profile', async () => {
      const { email, token } = await registerUser();

      const response = await request(httpServer())
        .get(`${baseUrl}/me`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const body = response.body as ApiResponse<UserResponseDto>;

      expect(body).toBeDefined();
      expect(body.data).toBeDefined();
      expect(body.data.email).toBe(email);
    });

    it('should reject unauthenticated requests', async () => {
      await request(httpServer()).get(`${baseUrl}/me`).expect(401);
    });
  });

  describe('PATCH /users/me', () => {
    it('should update the current user profile', async () => {
      const { token } = await registerUser();

      const response = await request(httpServer())
        .patch(`${baseUrl}/me`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'Updated',
          lastName: 'Name',
        })
        .expect(200);

      const body = response.body as ApiResponse<UserResponseDto>;

      expect(body).toBeDefined();
      expect(body.data).toBeDefined();
      expect(body.data.firstName).toBe('Updated');
      expect(body.data.lastName).toBe('Name');
    });

    it('should reject invalid payload', async () => {
      const { token } = await registerUser();

      await request(httpServer())
        .patch(`${baseUrl}/me`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 123,
          lastName: true,
        })
        .expect(400);
    });
  });

  describe('PATCH /users/me/deactivate', () => {
    it('should deactivate the current account', async () => {
      const { token } = await registerUser();

      const response = await request(httpServer())
        .patch(`${baseUrl}/me/deactivate`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const body = response.body as ApiResponse<UserResponseDto>;

      expect(body).toBeDefined();
      expect(body.data).toBeDefined();
      expect(body.data.isActive).toBe(false);
    });

    it('should prevent login after deactivation', async () => {
      const { email, password, token } = await registerUser();

      await request(httpServer())
        .patch(`${baseUrl}/me/deactivate`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      await request(httpServer())
        .post(`${authUrl}/login`)
        .send({
          email,
          password,
        })
        .expect(403);
    });
  });
});
