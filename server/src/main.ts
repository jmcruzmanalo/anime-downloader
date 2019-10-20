import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';


export async function bootstrap() {
  const logger = new Logger('Bootstrap');
  logger.log('Starting bootstrap');
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const port = 5000;
  logger.log('Starting listen');
  await app.listen(port);
  logger.log(`MODE: ${process.env.NODE_ENV}. App running on port ${port}!`);
}

if (process.env.NODE_ENV === 'development') {
  bootstrap();
}
