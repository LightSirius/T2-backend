import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const swagger_config = new DocumentBuilder()
    .setTitle('T2 Project API')
    .setDescription('T2 Backend API List')
    .setVersion('0.0.1')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'Token' })
    .build();
  const swagger_document = SwaggerModule.createDocument(app, swagger_config);
  SwaggerModule.setup('api-list', app, swagger_document);

  await app.listen(3000);
}
bootstrap();
