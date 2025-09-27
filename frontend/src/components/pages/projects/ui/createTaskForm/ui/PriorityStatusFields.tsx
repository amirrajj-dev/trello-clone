import { motion } from "framer-motion";
import { Flag, ClipboardList } from "lucide-react";
import { Priority, TaskStatus } from "@/types/enums/enums";

const PriorityStatusFields = ({
  priority,
  status,
  handleInputChange,
  isPending,
}: {
  priority: Priority;
  status: TaskStatus;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  isPending: boolean;
}) => {
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.LOW:
        return "text-success";
      case Priority.MEDIUM:
        return "text-warning";
      case Priority.HIGH:
        return "text-error";
      default:
        return "text-base-content";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-base-content">
          <Flag size={16} className={getPriorityColor(priority)} />
          Priority
        </label>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <select
            name="priority"
            value={priority}
            onChange={handleInputChange}
            disabled={isPending}
            className="select select-bordered w-full bg-base-200 border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          >
            <option value={Priority.LOW}>Low Priority</option>
            <option value={Priority.MEDIUM}>Medium Priority</option>
            <option value={Priority.HIGH}>High Priority</option>
          </select>
        </motion.div>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-base-content">
          <ClipboardList size={16} className="text-info" />
          Status
        </label>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <select
            name="status"
            value={status}
            onChange={handleInputChange}
            disabled={isPending}
            className="select select-bordered w-full bg-base-200 border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          >
            <option value={TaskStatus.TODO}>To Do</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.DONE}>Done</option>
          </select>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PriorityStatusFields;