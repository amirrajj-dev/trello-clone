import {
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from 'src/events/events.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getUserNotifications(@Req() req: { user: { id: string } }) {
    const userId = req.user.id;
    console.log('userId => ', userId);
    return this.eventsService.getUserNotifications(userId);
  }

  @Put(':id/read')
  async markAsRead(
    @Param('id') notificationId: string,
    @Req() req: { user: { id: string } },
  ) {
    const userId = req.user.id;
    const result = await this.eventsService.markAsRead(notificationId, userId);
    return result;
  }

  @Delete('delete-read')
  async deleteReadNotifications(@Req() req: { user: { id: string } }) {
    const userId = req.user.id;
    const count = await this.eventsService.deleteReadNotifications(userId);
    return { message: `Deleted ${count} read notifications` };
  }
}
