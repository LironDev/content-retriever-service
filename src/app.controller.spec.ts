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

  it('should return "pong" for ping', () => {
    expect(appController.ping()).toBe('pong');
  });

  it('should return status object', () => {
    const result = appController.status();
    expect(result).toHaveProperty('status');
    expect(result.status).toBe('ok');
  });
});
