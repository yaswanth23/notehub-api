import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // enabling swagger only on development
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Notes API')
      .setDescription('NoteHub API: Secure Note Management')
      .setVersion('1.0')
      .addTag('Notes Code System')
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      include: [],
      deepScanRoutes: true,
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    });
    SwaggerModule.setup('api', app, document);
  }
  await app.listen(9000);
}
bootstrap();
