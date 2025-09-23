import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WinstonLogger } from 'src/common/logger/logger.service';
import { Notification } from './types/notification.interface';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { validateSync } from 'class-validator';
import { NotificationDto } from './dtos/notification.dto';
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private logger: WinstonLogger,
    private eventEmitter: EventEmitter2,
  ) {}

  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (!userId) return;

    let sockets = this.connectedUsers.get(userId);
    if (!sockets) {
      sockets = new Set();
      this.connectedUsers.set(userId, sockets);
    }
    sockets.add(client.id);
    this.logger.log(`✅ User connected: ${userId} (socket: ${client.id})`);

    this.eventEmitter.emit('user.connected', userId);
  }

  @OnEvent('notification.created')
  handleNotificationCreated(payload: {
    userId: string;
    notification: NotificationDto;
  }) {
    try {
      const notificationDto = Object.assign(
        new NotificationDto(),
        payload.notification,
      );
      const errors = validateSync(notificationDto);
      if (errors.length > 0) {
        this.logger.warn(`⚠️ Invalid notification: ${JSON.stringify(errors)}`);
        return;
      }
      this.sendToUser(payload.userId, payload.notification);
    } catch (error) {
      this.logger.error(
        `❌ Failed to handle notification.created event: ${error.message}`,
        error.stack,
      );
    }
  }

  @OnEvent('notification.pending')
  handlePendingNotification(payload: { userId: string; notification: any }) {
    this.sendToUser(payload.userId, payload.notification);
  }

  @OnEvent('notifications.deleted')
  handleNotificationsDeleted(payload: { userId: string; count: number }) {
    const sockets = this.connectedUsers.get(payload.userId);
    if (!sockets || sockets.size === 0) return;

    sockets.forEach((socketId) => {
      this.server.to(socketId).emit('notifications.deleted', {
        message: `Deleted ${payload.count} read notifications`,
        count: payload.count,
      });
    });
  }

  @SubscribeMessage('notification_ack')
  async handleNotificationAck(
    client: Socket,
    payload: { notificationId: string },
  ) {
    try {
      if (!payload?.notificationId) {
        this.logger.warn(`⚠️ Missing notificationId in ack payload`);
        return;
      }

      await this.eventEmitter.emitAsync(
        'notification.ack',
        payload.notificationId,
      );

      this.logger.log(`✅ Notification ${payload.notificationId} ack received`);
    } catch (error) {
      this.logger.error(
        `❌ Failed to process ack for notification ${payload.notificationId}: ${error.message}`,
        error.stack,
      );
    }
  }

  private sendToUser(userId: string, notification: any) {
    const sockets = this.connectedUsers.get(userId);
    if (!sockets) return;

    const payload = this.trimNotification(notification);
    sockets.forEach((socketId) => {
      this.server.to(socketId).emit('notification', payload);
    });
  }

  handleDisconnect(client: Socket) {
    for (const [userId, sockets] of this.connectedUsers.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        if (sockets.size === 0) this.connectedUsers.delete(userId);
        this.logger.log(
          `❌ User disconnected: ${userId} (socket: ${client.id})`,
        );
        break;
      }
    }
  }

  // Public method for EventsService to call
  sendNotification(userId: string, notification: any) {
    const sockets = this.connectedUsers.get(userId);
    if (!sockets || sockets.size === 0) return;

    const payload = this.trimNotification(notification);
    for (const socketId of sockets) {
      this.server.to(socketId).emit('notification', payload);
    }
  }

  private trimNotification(notification: Notification) {
    return {
      id: notification.id,
      type: notification.type,
      message: notification.message,
      projectId: notification.projectId,
      taskId: notification.taskId,
      commentId: notification.commentId,
      createdAt: notification.createdAt,
      read: notification.read,
    };
  }

  @SubscribeMessage('delete_seen_notifications')
  async handleDeleteSeenNotifications(
    client: Socket,
    payload: { userId: string },
  ) {
    try {
      if (!payload?.userId) {
        this.logger.warn(
          `⚠️ Missing userId in delete_seen_notifications payload`,
        );
        return;
      }

      // Ask EventsService to delete, and return how many were removed
      const deletedCount = await this.eventEmitter.emitAsync(
        'notifications.deleteSeen',
        payload.userId,
      );

      // 🔹 Broadcast confirmation to the requesting client
      this.server.to(client.id).emit('notifications_deleted', {
        userId: payload.userId,
        deletedCount: deletedCount?.[0] ?? 0, // emitAsync returns an array of listener results
      });

      this.logger.log(
        `🗑️ User ${payload.userId} requested delete seen notifications, deleted ${deletedCount?.[0] ?? 0}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to process delete_seen_notifications for user ${payload?.userId}: ${error.message}`,
        error.stack,
      );
    }
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket, payload: any) {
    console.log(payload);
    return { message: 'pong', payload };
  }
}
