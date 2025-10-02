import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import NotificationItem from "./NotificationItem";
import { Notification } from "@/types/interfaces/interfaces";

const NotificationsList = ({
  notifications,
  isLoading,
  showRead,
  markAsRead,
}: {
  notifications: Notification[];
  isLoading: boolean;
  showRead: boolean;
  markAsRead: (id: string) => void;
}) => (
  <div className="max-h-96 overflow-y-auto">
    {isLoading ? (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mb-3"
        />
        <p className="text-base-content/60 text-sm">Loading notifications...</p>
      </div>
    ) : notifications.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Bell size={48} className="text-base-content/20 mb-3" />
        <p className="text-base-content/60 font-medium mb-1">
          {showRead ? "No notifications" : "No unread notifications"}
        </p>
        <p className="text-base-content/40 text-sm">
          {showRead ? "You're all caught up!" : "You're up to date!"}
        </p>
      </div>
    ) : (
      <div className="divide-y divide-base-300/30">
        {notifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            index={index}
            markAsRead={markAsRead}
          />
        ))}
      </div>
    )}
  </div>
);

export default NotificationsList;