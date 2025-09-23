import { Controller, Delete, Req, UseGuards } from '@nestjs/common';
import { EventsService } from 'src/events/events.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Delete('delete-read')
  async deleteReadNotifications(@Req() req: { user: { id: string } }) {
    const userId = req.user.id;
    const count = await this.eventsService.deleteReadNotifications(userId);
    return { message: `Deleted ${count} read notifications` };
  }
}
