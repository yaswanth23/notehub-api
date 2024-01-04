import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import '../types/request.types';

@Injectable()
export class JwtAuthenticationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new HttpException(
        'Authorization token required',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      throw new HttpException(
        'Authenticate token expired',
        HttpStatus.UNAUTHORIZED,
      );
    }

    next();
  }
}
