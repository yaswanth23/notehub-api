import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return server details', () => {
      const result = appController.ping();
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('server_time');
      expect(result.data).toHaveProperty('server_name');
      expect(result.data.server_name).toBe('notehub-api');
      expect(result.data).toHaveProperty('version');
      expect(result.data.version).toBe('1.0');
    });
  });
});
