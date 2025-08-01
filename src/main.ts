import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Collab Board API')
    .setDescription('The Collab Board API documentation')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('projects')
    .addTag('boards')
    .addTag('lists')
    .addTag('cards')
    .addTag('comments')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
