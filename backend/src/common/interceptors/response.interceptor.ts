import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T = unknown> {
  statusCode: number;
  data: T | null;
  message: string;
  fieldErrors: string[];
  error: boolean;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse();
    return next.handle().pipe(
      map((data) => {
        // If controller used res.* directly (streaming PDFs etc), response may already be sent
        const statusCode =
          (res && (res.statusCode || res.status)) || HttpStatus.OK;
        const payload: StandardResponse = {
          statusCode,
          data: data === undefined ? null : data,
          message: 'Success',
          fieldErrors: [],
          error: false,
        };
        return payload;
      }),
    );
  }
}
