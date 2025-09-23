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
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000', // Vercel frontend URL
      ...(NODE_ENV === 'development' ? ['http://localhost:3000'] : []), // local dev
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true, // For authenticated WebSocket connections
  });
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
