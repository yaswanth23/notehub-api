import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ValidationPipe } from '@nestjs/common';
import { BigIntSerializerPipe } from '../../src/common/pipes/bigIntSerializer.pipe';
import { BigIntInterceptor } from '../../src/common/interceptors/bigInt.interceptor';
import { AppModule } from '../../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe(), new BigIntSerializerPipe());
    app.useGlobalInterceptors(new BigIntInterceptor());
    await app.init();
  });

  it('/api/auth/signup (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/signup')
      .send({
        userName: 'test',
        emailId: 'test@mail.com',
        password: 'test',
      })
      .expect((res) => {
        if (res.status === 201) {
          expect(res.body.statusCode).toEqual(201);
          expect(res.body.message).toEqual('User created successfully.');
          expect(res.body.data).toHaveProperty('userId');
        } else if (res.status === 400) {
          expect(res.body.statusCode).toEqual(400);
          expect(res.body.message).toEqual('Email Id already exists.');
        }
      });
  });

  it('/api/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        emailId: 'test@mail.com',
        password: 'test',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.statusCode).toEqual(200);
        expect(res.body.message).toEqual('User logged in successfully.');
        expect(res.body.data).toHaveProperty('userId');
        expect(res.body.data).toHaveProperty('userName', 'test');
        expect(res.body.data).toHaveProperty('accessToken');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
