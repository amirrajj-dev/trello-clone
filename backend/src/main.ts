import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exceptiot.filter';
import { ResponseInterceptor } from './common/intercepters/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const NODE_ENV = configService.get<string>('NODE_ENV');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      enableDebugMessages: NODE_ENV === 'development',
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true, // for using transform for dtos
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
