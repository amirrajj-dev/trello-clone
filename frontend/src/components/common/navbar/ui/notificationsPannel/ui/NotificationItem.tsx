import { motion } from "framer-motion";
import { CheckCircle, Target, Trash2, MessageSquare, User, Settings, Folder, Crown, Bell } from "lucide-react";
import Link from "next/link";
import { Notification} from "@/types/interfaces/interfaces";
import { format, formatDistanceToNow } from "date-fns";
import { NotificationType } from "@/types/enums/enums";

const NotificationItem = ({
  notification,
  index,
  markAsRead,
}: {
  notification: Notification;
  index: number;
  markAsRead: (id: string) => void;
}) => {
  const getNotificationLink = (notification: Notification) => {
    if (notification.projectId && notification.taskId) {
      return `/projects/${notification.projectId}`;
    } else if (notification.projectId) {
      return `/projects/${notification.projectId}`;
    }
    return '#';
  };

  const getNotificationIcon = (type: NotificationType) => {
    const iconProps = { size: 18 };
    switch (type) {
      case 'TASK_ASSIGNED':
        return <Target {...iconProps} className="text-blue-500" />;
      case 'TASK_UNASSIGNED':
        return <Target {...iconProps} className="text-gray-500" />;
      case 'TASK_STATUS_CHANGED':
        return <CheckCircle {...iconProps} className="text-green-500" />;
      case 'TASK_DELETED':
        return <Trash2 {...iconProps} className="text-red-500" />;
      case 'TASK_PROGRESS_UPDATED':
        return <Target {...iconProps} className="text-orange-500" />;
      case 'COMMENT_ADDED':
        return <MessageSquare {...iconProps} className="text-purple-500" />;
      case 'COMMENT_UPDATED':
        return <MessageSquare {...iconProps} className="text-indigo-500" />;
      case 'COMMENT_DELETED':
        return <MessageSquare {...iconProps} className="text-red-400" />;
      case 'PROJECT_MEMBER_ADDED':
        return <User {...iconProps} className="text-green-500" />;
      case 'PROJECT_MEMBER_REMOVED':
        return <User {...iconProps} className="text-red-500" />;
      case 'ROLE_CHANGED':
        return <Settings {...iconProps} className="text-yellow-500" />;
      case 'OWNERSHIP_TRANSFERRED':
        return <Crown {...iconProps} className="text-amber-500" />;
      case 'PROJECT_DELETED':
        return <Folder {...iconProps} className="text-red-500" />;
      case 'PROJECT_UPDATED':
        return <Folder {...iconProps} className="text-blue-500" />;
      default:
        return <Bell {...iconProps} className="text-base-content/70" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'TASK_ASSIGNED':
      case 'TASK_PROGRESS_UPDATED':
        return 'border-l-blue-500';
      case 'TASK_STATUS_CHANGED':
      case 'PROJECT_MEMBER_ADDED':
        return 'border-l-green-500';
      case 'COMMENT_ADDED':
      case 'COMMENT_UPDATED':
        return 'border-l-purple-500';
      case 'ROLE_CHANGED':
      case 'OWNERSHIP_TRANSFERRED':
        return 'border-l-yellow-500';
      case 'TASK_DELETED':
      case 'PROJECT_MEMBER_REMOVED':
      case 'PROJECT_DELETED':
        return 'border-l-red-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const formatNotificationTime = (date: string) => {
    const notificationDate = new Date(date);
    const now = new Date();
    const diffInHours = (now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60);
    return diffInHours < 24
      ? formatDistanceToNow(notificationDate, { addSuffix: true })
      : format(notificationDate, 'MMM d, yyyy');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`relative border-l-4 ${getNotificationColor(notification.type)} ${
        notification.read ? 'bg-base-200/50' : 'bg-base-200'
      } hover:bg-base-300/30 transition-all duration-200`}
    >
      {!notification.read && (
        <div className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full animate-pulse" />
      )}
      <div className="p-4 flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <Link
            href={getNotificationLink(notification)}
            onClick={() => markAsRead(notification.id)}
            className="text-sm text-base-content hover:text-primary transition-colors leading-relaxed block"
          >
            {notification.message}
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-base-content/50">
              {formatNotificationTime(notification.createdAt)}
            </span>
            {notification.projectId && (
              <>
                <span className="text-base-content/30">•</span>
                <span className="text-xs text-primary font-medium">Project</span>
              </>
            )}
          </div>
        </div>
        {!notification.read && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => markAsRead(notification.id)}
            className="btn btn-ghost btn-circle btn-sm text-base-content/40 hover:text-success hover:bg-success/10 flex-shrink-0"
            title="Mark as read"
          >
            <CheckCircle size={16} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationItem;