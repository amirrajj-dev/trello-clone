import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, AlertCircle } from "lucide-react";

const TaskTitleInput = ({
  title,
  handleInputChange,
  errors,
  isPending,
}: {
  title: string;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  errors: Record<string, string>;
  isPending: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 }}
    className="space-y-2"
  >
    <label className="flex items-center gap-2 text-sm font-medium text-base-content">
      <ClipboardList size={16} className="text-primary" />
      Task Title *
    </label>
    <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
      <input
        type="text"
        name="title"
        value={title}
        onChange={handleInputChange}
        placeholder="What needs to be done? (4-60 characters)"
        disabled={isPending}
        className={`input input-bordered w-full bg-base-200 border-base-300 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 h-12 px-4 ${
          errors.title
            ? "input-error focus:ring-error/20 focus:border-error"
            : "focus:ring-primary/20 focus:border-primary"
        }`}
        maxLength={60}
      />
    </motion.div>
    <div className="flex justify-between items-center">
      <AnimatePresence>
        {errors.title ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-error text-xs flex items-center gap-1"
          >
            <AlertCircle size={12} />
            {errors.title}
          </motion.span>
        ) : (
          <span className="text-xs text-base-content/40">
            Give your task a clear title
          </span>
        )}
      </AnimatePresence>
      <span
        className={`text-xs ${
          title.length > 50 ? "text-warning" : "text-base-content/40"
        }`}
      >
        {title.length}/60
      </span>
    </div>
  </motion.div>
);

export default TaskTitleInput;