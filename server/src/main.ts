import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { getStartupConfig } from './config/config.startup';
import * as cookieParser from 'cookie-parser';

import helmet from 'helmet';
import { Logger } from './common/logger/logger.service';

async function bootstrap() {
  getStartupConfig();
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Yacht API')
    .setDescription('Yacht API for interacting with docker containers.')
    .setVersion('0.0.1')
    .addBearerAuth({
      flows: {
        password: {
          tokenUrl: '/api/auth/login',
          scopes: null,
        },
      },
      type: 'http',
    })
    .addTag('Auth')
    .addTag('User Management')
    .addTag('Setup Wizard')
    .addTag('Containers')
    .addTag('Projects')
    .addTag('Templates')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.use(cookieParser());
  // app.use(helmet({
  //   contentSecurityPolicy: false,
  // }));

  const logger = new Logger();
  logger.setContext('Yacht')
  await app.listen(3000, '0.0.0.0', function () {
    logger.success('Listening to port: ' + 3000);
  });
}
bootstrap();