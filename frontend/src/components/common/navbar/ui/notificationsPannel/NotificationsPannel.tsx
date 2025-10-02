'use client';
import { AnimatePresence, motion } from "framer-motion";
import { useGetMe } from "@/hooks/queries/user";
import { useNotifications } from "@/hooks/notifications";
import { useState } from "react";
import NotificationsHeader from "./ui/NotificationsHeader";
import NotificationsList from "./ui/NotificationsList";
import NotificationsFooter from "./ui/NotificationsFooter";

const NotificationsPanel = ({
  showNotifications,
  setShowNotifications,
}: {
  showNotifications: boolean;
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data: user } = useGetMe();
  const { notifications, isLoading, markAsRead, deleteReadNotifications } = useNotifications(user?.id || '');
  const [showRead, setShowRead] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);
  const displayedNotifications = showRead ? notifications : unreadNotifications;

  return (
    <AnimatePresence>
      {showNotifications && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, type: "spring" }}
          className="absolute top-16 right-0 md:right-8 mt-2 w-full md:w-96 max-h-[480px] bg-base-100/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-base-300/50 z-50 overflow-hidden"
        >
          <NotificationsHeader
            unreadCount={unreadNotifications.length}
            totalCount={notifications.length}
            showRead={showRead}
            setShowRead={setShowRead}
            deleteReadNotifications={deleteReadNotifications}
            isLoading={isLoading}
            setShowNotifications={setShowNotifications}
          />
          <NotificationsList
            notifications={displayedNotifications}
            isLoading={isLoading}
            showRead={showRead}
            markAsRead={markAsRead}
          />
          <NotificationsFooter
            unreadNotifications={unreadNotifications}
            readNotifications={readNotifications}
            markAsRead={markAsRead}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationsPanel;