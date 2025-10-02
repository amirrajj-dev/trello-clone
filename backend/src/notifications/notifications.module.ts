import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { EventsModule } from 'src/events/events.module';
import { NotificationsController } from './notifications.controller';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsGateway],
  exports: [NotificationsGateway],
  imports: [EventsModule],
})
export class NotificationsModule {}
