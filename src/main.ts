import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Yacht API')
    .setDescription('Yacht API for interacting with docker containers.')
    .setVersion('0.0.1')
    .addTag('containers')
    .addTag('projects')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, '0.0.0.0', function () {
    console.log('Listening to port: ' + 3000);
  });
}
bootstrap();
