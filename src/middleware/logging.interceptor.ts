import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '../common/logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    this.logger.info(
      `Test ${request.hostname} ${request.port || ''} ${request.originalUrl}`,
    );
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        this.logger.info(
          `${method} ${url} ${statusCode} - ${
            Date.now() - now
          }ms, Date: ${new Date().toISOString()}`,
        );
        // this.logger.debug({
        //     api : request.originalUrl,
        //     request_ts: request.request_ts,
        //     conversation_id:
        //         request.get('request_id') || request.conversation_id,
        //     payload: request.body,
        //     headers: request.headers
        // });
      }),
    );
  }
}
