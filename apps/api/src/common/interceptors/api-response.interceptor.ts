import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();

    const start = Date.now();

    return next.handle().pipe(
      map((result: T) => {
        const message =
          typeof result === 'object' &&
          result !== null &&
          'message' in result &&
          typeof (result as Record<string, unknown>).message === 'string'
            ? (result as Record<string, unknown>).message
            : 'success';

        const data =
          result && typeof result === 'object' && 'data' in result
            ? (result as Record<string, unknown>).data
            : result;

        return {
          success: true,
          message,
          data,
          error: null,
          meta: {
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
            method: req.method,
            // requestId: req.requestId,
            latencyMs: Date.now() - start,
            ip: req.ip,
          },
        };
      }),
    );
  }
}
