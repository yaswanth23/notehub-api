import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ValidationPipe } from '@nestjs/common';
import { BigIntSerializerPipe } from '../../src/common/pipes/bigIntSerializer.pipe';
import { BigIntInterceptor } from '../../src/common/interceptors/bigInt.interceptor';
import { AppModule } from './../../src/app.module';

describe('NotesController', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe(), new BigIntSerializerPipe());
    app.useGlobalInterceptors(new BigIntInterceptor());
    await app.init();

    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        emailId: 'test@mail.com',
        password: 'test',
      });

    accessToken = response.body.data.accessToken;
  });

  it('/GET all notes', () => {
    return request(app.getHttpServer())
      .get('/api/notes')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('/POST create note', () => {
    return request(app.getHttpServer())
      .post('/api/notes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Test Note',
        content: 'This is a test note.',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.statusCode).toEqual(200);
        expect(res.body.message).toEqual('success');
        expect(res.body.data).toHaveProperty('noteId');
      });
  });

  it('/PUT update note', () => {
    const noteId = '2';
    return request(app.getHttpServer())
      .put(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Updated Test Note',
        content: 'This is an updated test note.',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.statusCode).toEqual(200);
        expect(res.body.message).toEqual('success');
        expect(res.body.data).toHaveProperty('noteId');
      });
  });

  it('/GET note by id', () => {
    const noteId = '2';
    return request(app.getHttpServer())
      .get(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.statusCode).toEqual(200);
        expect(res.body.message).toEqual('success');
        expect(res.body.data).toHaveProperty('note_id');
      });
  });

  it('/POST share note', () => {
    const noteId = '2';
    const sharedWithUserId = '398160118095515650'; // replace with the actual userId
    return request(app.getHttpServer())
      .post(`/api/notes/${noteId}/share`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        sharedWithUserId: sharedWithUserId,
      })
      .expect((res) => {
        if (res.body.statusCode === 200) {
          expect(res.body.statusCode).toEqual(200);
          expect(res.body.message).toEqual('success');
          expect(res.body.data).toHaveProperty('noteId');
        } else if (res.body.statusCode === 409) {
          expect(res.body.statusCode).toEqual(409);
          expect(res.body.message).toEqual(
            'Note has already been shared with this user',
          );
        }
      });
  });

  it('/GET search notes', () => {
    const query = 'Test';
    return request(app.getHttpServer())
      .get(`/api/notes/search?q=${query}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.statusCode).toEqual(200);
        expect(res.body.message).toEqual('success');
        expect(res.body.data).toBeInstanceOf(Array);
      });
  });

  it('/DELETE note', () => {
    const noteId = '5';
    return request(app.getHttpServer())
      .delete(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect((res) => {
        if (res.status === 200) {
          expect(res.body.statusCode).toEqual(200);
          expect(res.body.message).toEqual('Note deleted successfully');
          expect(res.body.deletedNoteId).toEqual(noteId);
        } else if (res.status === 404) {
          expect(res.body.statusCode).toEqual(404);
          expect(res.body.error).toEqual('Not Found');
        }
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
