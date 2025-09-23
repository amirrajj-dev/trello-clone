import { NOTIFICATIONTYPE } from 'src/common/types/notification.type';

export interface Notification {
  userId: string;
  id: string;
  type: NOTIFICATIONTYPE;
  message: string;
  projectId: string | null;
  taskId: string | null;
  commentId: string | null;
  read: boolean;
  createdAt: Date;
}
