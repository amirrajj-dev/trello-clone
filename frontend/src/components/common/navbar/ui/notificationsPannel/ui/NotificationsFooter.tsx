import { Notification } from "@/types/interfaces/interfaces";

const NotificationsFooter = ({
  unreadNotifications,
  readNotifications,
  markAsRead,
}: {
  unreadNotifications: Notification[];
  readNotifications: Notification[];
  markAsRead: (id: string) => void;
}) => (
  <>
  {(unreadNotifications.length > 0 || readNotifications.length > 0) && (
    <div className="p-3 border-t border-base-300/50 bg-base-200/50">
      <div className="flex items-center justify-between text-xs text-base-content/60">
        <span>
          {unreadNotifications.length} unread • {readNotifications.length} read
        </span>
        {unreadNotifications.length > 0 && (
          <button
            onClick={() => {
              unreadNotifications.forEach(notification => {
                markAsRead(notification.id);
              });
            }}
            className="text-primary cursor-pointer hover:text-primary/80 font-medium transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>
    </div>
  )}
  </>
);

export default NotificationsFooter;