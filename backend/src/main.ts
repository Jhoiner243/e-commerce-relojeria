import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configCors } from './common/cors/config-cors';
import { HttpExceptionFilter } from './common/filters/exception';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors(configCors);

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3003);
  logger.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3003}`,
  );
}
bootstrap();
