import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StandardResponse } from './response.interceptor';
import { HttpException } from '@nestjs/common';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<StandardResponse> { //change
    const req = context.switchToHttp().getRequest();
    return next.handle().pipe(
      catchError((err) => {
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        const fieldErrors: string[] = [];

        if (err instanceof HttpException) {
          status = err.getStatus();
          const res = err.getResponse();
          if (typeof res === 'string') {
            message = res;
          } else if (res && typeof res === 'object') {
            const body: any = res;
            if (Array.isArray(body.message)) {
              message = 'Validation failed';
              body.message.forEach((m: any) => {
                if (typeof m === 'string') fieldErrors.push(m);
                else if (m && m.constraints)
                  fieldErrors.push(
                    ...Object.values(m.constraints).map((v) => String(v)),
                  );
              });
            } else if (body.message) {
              message = String(body.message);
            }
            if (Array.isArray(body.fieldErrors))
              fieldErrors.push(
                ...body.fieldErrors.filter((x: any) => typeof x === 'string'),
              );
          }
        } else if (err instanceof Error) {
          message = err.message;
        }

        const payload: StandardResponse = {
          statusCode: status,
          data: null,
          message,
          fieldErrors,
          error: true,
        };

        // minimal server-side log
        // eslint-disable-next-line no-console
        console.error(
          `[ERR] ${req?.method || 'NA'} ${req?.url || 'NA'}`,
          message,
        );

        return throwError(() => new HttpException(payload, status));
      }),
    );
  }
}
