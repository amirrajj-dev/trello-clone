import { motion } from "framer-motion";
import { Bell, Eye, EyeOff, Trash2, X } from "lucide-react";

const NotificationsHeader = ({
  unreadCount,
  totalCount,
  showRead,
  setShowRead,
  deleteReadNotifications,
  isLoading,
  setShowNotifications,
}: {
  unreadCount: number;
  totalCount: number;
  showRead: boolean;
  setShowRead: React.Dispatch<React.SetStateAction<boolean>>;
  deleteReadNotifications: () => void;
  isLoading: boolean;
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <div className="p-4 border-b border-base-300/50 bg-gradient-to-r from-base-200 to-base-300">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/20 rounded-xl">
          <Bell size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-base-content text-lg">Notifications</h3>
          <p className="text-xs text-base-content/60">
            {unreadCount} unread • {totalCount} total
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowRead(!showRead)}
          className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-base-content"
          title={showRead ? "Hide read notifications" : "Show read notifications"}
        >
          {showRead ? <EyeOff size={16} /> : <Eye size={16} />}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={deleteReadNotifications}
          disabled={isLoading || totalCount - unreadCount === 0}
          className="btn btn-ghost cursor-pointer btn-circle btn-sm text-base-content/60 hover:text-error disabled:opacity-30"
          title="Clear all read notifications"
        >
          <Trash2 size={16} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowNotifications(false)}
          className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-base-content"
        >
          <X size={16} />
        </motion.button>
      </div>
    </div>
  </div>
);

export default NotificationsHeader;