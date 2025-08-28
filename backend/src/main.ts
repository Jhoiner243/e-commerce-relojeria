import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configCors } from './common/cors/config-cors';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors(configCors);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  logger.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
}
bootstrap();
