import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { EventsModule } from 'src/events/events.module';

@Module({
  providers: [NotificationsGateway],
  exports: [NotificationsGateway],
  imports: [EventsModule],
})
export class NotificationsModule {}
