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
    await this.sendPendingNotifications(userId);
  }

  async sendNotification(
    userId: string,
    type: NOTIFICATIONTYPE,
    message: string,
    options?: SendNotificationOptions,
  ) {
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

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prismaService.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    // Emit event for real-time update
    this.eventEmitter.emit('notification.read', {
      userId,
      notificationId: notification.id,
    });

    this.logger.log(`📖 Notification ${notificationId} marked as read for user ${userId}`);
    return notification;
  }

  async sendPendingNotifications(userId: string) {
    try {
      const pendingNotifications = await this.getUserNotifications(userId);
      const unreadNotifications = pendingNotifications.filter((n) => !n.read);

      // Only send recent notifications to avoid duplicates
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentUnread = unreadNotifications.filter(
        (n) => new Date(n.createdAt) > oneHourAgo
      );

      for (const notification of recentUnread) {
        this.eventEmitter.emit('notification.pending', {
          userId,
          notification,
        });
      }

      this.logger.log(
        `Sent ${recentUnread.length} pending notifications to user ${userId}`,
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
      // Find notification to get userId
      const notification = await this.prismaService.notification.findUnique({
        where: { id: notificationId },
      });

      if (notification) {
        await this.markAsRead(notificationId, notification.userId);
      }
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
        where: { userId, read: true },
      });

      this.logger.log(
        `🗑️ Deleted ${result.count} seen notifications for user ${userId}`,
      );

      return result.count;
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