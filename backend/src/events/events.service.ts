import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WinstonLogger } from 'src/common/logger/logger.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { NOTIFICATIONTYPE } from 'src/common/types/notification.type';

interface SendNotificationOptions {
  projectId?: string;
  taskId?: string;
  commentId?: string;
}

@Injectable()
export class EventsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private logger: WinstonLogger,
  ) {}

  @OnEvent('user.connected')
  async handleUserConnected(userId: string) {
    // Send pending notifications via the same event flow (notification.pending) or directly:
    await this.sendPendingNotifications(userId);
  }

  async sendNotification(
    userId: string,
    type: NOTIFICATIONTYPE,
    message: string,
    options?: SendNotificationOptions,
  ) {
    // 1️⃣ Save in DB
    const notification = await this.prismaService.notification.create({
      data: {
        userId,
        type,
        message,
        projectId: options?.projectId,
        taskId: options?.taskId,
        commentId: options?.commentId,
      },
    });

    this.eventEmitter.emit('notification.created', { userId, notification });

    return notification;
  }

  async getUserNotifications(userId: string) {
    return this.prismaService.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(notificationId: string) {
    return this.prismaService.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }
  async sendPendingNotifications(userId: string) {
    try {
      const pendingNotifications = await this.getUserNotifications(userId);
      const unreadNotifications = pendingNotifications.filter((n) => !n.read);

      for (const notification of unreadNotifications) {
        this.eventEmitter.emit('notification.pending', {
          userId,
          notification,
        });
      }

      this.logger.log(
        `Sent ${unreadNotifications.length} pending notifications to user ${userId}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send pending notifications to user ${userId}: ${error.message}`,
      );
      throw new Error(`Failed to send notifications: ${error.message}`);
    }
  }

  @OnEvent('notification.ack')
  async handleNotificationAck(notificationId: string) {
    try {
      await this.markAsRead(notificationId);
      this.logger.log(`📖 Notification ${notificationId} marked as read`);
    } catch (error) {
      this.logger.error(
        `⚠️ Failed to mark notification ${notificationId} as read: ${error.message}`,
      );
    }
  }
  @OnEvent('notifications.deleteSeen')
  async handleDeleteSeenNotifications(userId: string) {
    try {
      const result = await this.prismaService.notification.deleteMany({
        where: {
          userId,
          read: true, // delete only read notifications
        },
      });

      this.logger.log(
        `🗑️ Deleted ${result.count} seen notifications for user ${userId}`,
      );

      return result.count; // 🔹 so gateway can broadcast how many were deleted
    } catch (error) {
      this.logger.error(
        `⚠️ Failed to delete seen notifications for user ${userId}: ${error.message}`,
      );
      return 0;
    }
  }

  async deleteReadNotifications(userId: string) {
    try {
      const deleted = await this.prismaService.notification.deleteMany({
        where: { userId, read: true },
      });

      this.logger.log(
        `Deleted ${deleted.count} read notifications for user ${userId}`,
      );

      this.eventEmitter.emit('notifications.deleted', {
        userId,
        count: deleted.count,
      });

      return deleted.count;
    } catch (error) {
      this.logger.error(
        `Failed to delete read notifications for user ${userId}: ${error.message}`,
      );
      throw new Error(`Failed to delete notifications: ${error.message}`);
    }
  }
}
