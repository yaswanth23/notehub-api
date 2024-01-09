import { NestFactory } from '@nestjs/core';
const rateLimit = require('express-rate-limit');
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { BigIntSerializerPipe } from './common/pipes/bigIntSerializer.pipe';
import { BigIntInterceptor } from './common/interceptors/bigInt.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { NotesModule } from './modules/notes/notes.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
    }),
  );
  // enabling swagger only on development
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Notehub API')
      .setDescription('NoteHub API: Secure Note Management')
      .setVersion('1.0')
      .addTag('NoteHub Code System')
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      include: [AuthModule, NotesModule],
      deepScanRoutes: true,
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    });
    SwaggerModule.setup('api', app, document);
  }
  app.useGlobalPipes(new ValidationPipe(), new BigIntSerializerPipe());
  app.useGlobalInterceptors(new BigIntInterceptor());
  await app.listen(9000);
}
bootstrap();
