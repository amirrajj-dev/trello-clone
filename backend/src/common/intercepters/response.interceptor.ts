import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

interface ResponseI<T> {
  success: boolean;
  timestamp: Date;
  data: T;
  message: string;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseI<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const response: Response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => ({
        success: statusCode >= 200 && statusCode < 300,
        message: this.getMessage(statusCode, data),
        timestamp: new Date(),
        data: data || null,
      })),
    );
  }
  getMessage(statusCode: number, data: any): string {
    if (data && data.message && typeof data.message === 'string') {
      return data.message;
    }
    if (statusCode >= 400) {
      return 'Opreation Failed';
    }
    if (Array.isArray(data)) {
      return `Retrieved ${data.length} items successfully`;
    }
    if (data && typeof data === 'object') {
      return 'Operation completed successfully';
    }
    return 'Success';
  }
}
