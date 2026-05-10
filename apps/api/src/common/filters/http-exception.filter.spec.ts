import { Response } from 'express';
import { HttpExceptionFilter } from './http-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

type MockRequest = Partial<Request> & {
  originalUrl: string;
  method: string;
  ip: string;
};

type MockResponse = Partial<Response> & {
  status: jest.Mock;
  json: jest.Mock;
};

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  const mockResponse = (): MockResponse => {
    const res: Partial<MockResponse> = {};

    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();

    return res as MockResponse;
  };

  const mockRequest = (): MockRequest => ({
    originalUrl: '/test',
    method: 'GET',
    ip: '127.0.0.1',
  });

  const mockHost = (res: MockResponse, req: MockRequest) =>
    ({
      switchToHttp: () => ({
        getResponse: () => res,
        getRequest: () => req,
      }),
    }) as unknown as ArgumentsHost;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
  });

  it('should format HttpException correctly', () => {
    const res = mockResponse();
    const req = mockRequest();
    const host = mockHost(res, req);

    const exception = new HttpException('Bad Request', HttpStatus.BAD_REQUEST);

    filter.catch(exception, host);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Bad Request',
        data: null,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        meta: expect.objectContaining({
          path: '/test',
          method: 'GET',
          ip: '127.0.0.1',
        }),
      }),
    );
  });

  it('should handle unknown exceptions', () => {
    const res = mockResponse();
    const req = mockRequest();
    const host = mockHost(res, req);

    filter.catch(new Error('Unexpected'), host);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Internal server error',
      }),
    );
  });
});
