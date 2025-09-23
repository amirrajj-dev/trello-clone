import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './common/logger/logger.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        NODE_ENV: Joi.string().required().valid('development', 'production'),
        SALT: Joi.number().required().default(10),
        ALLOWED_EMAIL_DOMAINS: Joi.string().required().default('gmail.com'),
        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
        FRONTEND_URL: Joi.string().required().default('http://localhost:3000'),
      }),
    }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    LoggerModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    TasksModule,
    CommentsModule,
    NotificationsModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
