import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exceptiot.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const NODE_ENV = configService.get<string>('NODE_ENV');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      enableDebugMessages: NODE_ENV === 'development',
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
