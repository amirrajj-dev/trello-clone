import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Loader, X } from "lucide-react";

const ActionButtons = ({
  isPending,
  handleDelete,
  handleCancel,
}: {
  isPending: boolean;
  handleDelete: () => void;
  handleCancel: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="flex gap-3"
  >
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCancel}
      className="btn btn-ghost flex-1 rounded-xl border border-base-300 hover:bg-base-300 transition-all duration-200 flex items-center gap-2"
      disabled={isPending}
    >
      <X size={16} />
      Cancel
    </motion.button>
    <motion.button
      type="button"
      whileHover={{ scale: isPending ? 1 : 1.02 }}
      whileTap={{ scale: isPending ? 1 : 0.98 }}
      onClick={handleDelete}
      className="btn btn-error flex-1 rounded-xl bg-gradient-to-r from-error to-red-600 hover:from-error/90 hover:to-red-600/90 text-error-content shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 relative overflow-hidden flex items-center gap-2"
      disabled={isPending}
    >
      <AnimatePresence mode="wait">
        {isPending ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Loader size={16} className="animate-spin" />
            Deleting...
          </motion.div>
        ) : (
          <motion.div
            key="delete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete Task
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"
        initial={{ x: "-100%" }}
        whileHover={{ x: "200%" }}
        transition={{ duration: 0.8 }}
      />
    </motion.button>
  </motion.div>
);

export default ActionButtons;