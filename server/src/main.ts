import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

import helmet from 'helmet';
import { Logger } from './common/logger/logger.service';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(await app.resolve(Logger));
  const configService = app.get(ConfigService)
  configService.getStartupConfig();
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

  await app.listen(3000, '0.0.0.0', function () {
    console.log('Listening to port: ' + 3000);
  });
}
bootstrap();