import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    cors: true
  });
  const port = 5000;
  await app.listen(port);
  logger.log(`MODE: ${process.env.NODE_ENV}. App running on port ${port}!`);
}
bootstrap();
