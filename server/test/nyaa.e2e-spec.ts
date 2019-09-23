import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as rimraf from 'rimraf';
import { SubscriptionEntity } from '../src/nyaa/subscription.entity';
import { Subscription } from '../src/nyaa/subscription.interface';
import { NyaaItem } from '../src/nyaa/dto/nyaa-response-item';

describe('NyaaController (e2e)', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    //
  });

  describe('subscribe and get subscription flow', () => {
    it('should create delete existing database', async () => {
      await rimraf(__dirname + '/../db/test-database.db', () => {
        console.log('Deleted database');
      });
    });
    it('/subscribe (POST)', () => {
      return request(app.getHttpServer())
        .post('/nyaa/subscribe')
        .send({
          animeName: 'kimetsu no yaiba',
        })
        .expect(201);
    });

    it('/subscriptions (GET)', async () => {
      const response: request.Response = await request(app.getHttpServer())
        .get('/nyaa/subscriptions')
        .expect(200);
      const { body } = response;
      const expected: Subscription = {
        animeName: 'kimetsu no yaiba',
        id: expect.anything(),
        nyaaResponse: expect.anything(),
      };
      expect(body).toContainEqual(expect.objectContaining(expected));
      expect(body.nyaaResponse).toContainEqual({
        links: expect.objectContaining({
          magnet: expect.anything(),
        }),
      });
    });
  });
});
