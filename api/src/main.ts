import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { swaggerConfig } from './config/docs/swagger.config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());

  swaggerConfig(app);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const config = app.get<ConfigService>(ConfigService);
  const port = config.get<number>('PORT');

  await app.listen(port, () => {
    logger.log(`Application is running on: http://localhost:${port}`);
  });
}
bootstrap();
