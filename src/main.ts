import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { getStartupConfig } from './config/config.startup';

import helmet from 'helmet';
import { Logger } from './logger/logger.service';

async function bootstrap() {
  await getStartupConfig();

  const app = await NestFactory.create(AppModule, {
    cors: true,
    snapshot: true,
    logger: ['error', 'warn', 'log'],
  });

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
      type: 'http'
    })
    .addTag('containers')
    .addTag('projects')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(helmet());

  const logger = new Logger();
  
  await app.listen(3000, '0.0.0.0', function () {
    logger.log('Listening to port: ' + 3000);
  });
}
bootstrap();
