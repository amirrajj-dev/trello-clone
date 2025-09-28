import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const WarningCard = ({ taskTitle }: { taskTitle: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="bg-error/10 border border-error/20 rounded-xl p-4 mb-6"
  >
    <div className="flex items-start gap-3">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <AlertTriangle size={20} className="text-error mt-0.5" />
      </motion.div>
      <div className="space-y-2">
        <p className="text-error font-medium text-sm">
          Are you sure you want to delete this task?
        </p>
        <div className="bg-base-100 rounded-lg p-3 border border-base-300">
          <p className="text-base-content font-semibold text-sm truncate">
            "{taskTitle}"
          </p>
        </div>
        <p className="text-error/80 text-xs">
          All task data, comments, and attachments will be permanently removed.
        </p>
      </div>
    </div>
  </motion.div>
);

export default WarningCard;