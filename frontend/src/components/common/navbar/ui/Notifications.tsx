'use client';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useGetMe } from '@/hooks/queries/user';
import { useNotifications } from '@/hooks/notifications';

const Notifications = ({
  showNotifications,
  setShowNotifications,
}: {
  showNotifications: boolean;
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data: user } = useGetMe();
  const { unreadCount } = useNotifications(user?.id || '');

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setShowNotifications(!showNotifications)}
      className="relative p-2 text-base-content/70 hover:text-primary hover:bg-base-300 rounded-xl transition-colors"
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-base-100 flex items-center justify-center text-xs text-base-100">
          {unreadCount}
        </span>
      )}
    </motion.button>
  );
};

export default Notifications;