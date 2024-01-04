import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import stringifyWithBigIntSupport from '../../utils/functions/bigIntSerializer';

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<any>> {
    const ResponseObj: Response = context.switchToHttp().getResponse();
    ResponseObj.setHeader('Content-Type', 'application/json');
    return next.handle().pipe(map((data) => stringifyWithBigIntSupport(data)));
  }
}
