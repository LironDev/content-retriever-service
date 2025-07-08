import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ContentRetrieverController (e2e)', () => {
  let app: INestApplication;
  const TEST_URL = 'https://github.com'; // choose url that forsure exists..

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/fetch (POST)', () => {
    it('should return 202 for valid urls', async () => {
      const response = await request(app.getHttpServer())
        .post('/fetch')
        .send({ urls: [TEST_URL] });
      expect(response.status).toBe(202);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app.getHttpServer())
        .post('/fetch')
        .send({ urls: [] });
      expect(response.status).toBe(400);
    });
  });

  describe('/fetch (GET)', () => {
    it('should return 200 with content', async () => {
      const response = await request(app.getHttpServer())
        .get(`/fetch?url=${TEST_URL}`);
      expect(response.status).toBe(200);
    });

    it('should return 400 if url param is missing', async () => {
      const response = await request(app.getHttpServer())
        .get('/fetch');
      expect(response.status).toBe(400);
    });
  });
}); 