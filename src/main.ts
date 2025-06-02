import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //adding whitelist will ensure only predefined attr in dtos are passed to controller and any extra attr from client will be stripped away
      forbidNonWhitelisted: true, //adding this will throw an error in unnecessary attr are passed by client
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
