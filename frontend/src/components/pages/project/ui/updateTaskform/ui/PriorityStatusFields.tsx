import { motion } from "framer-motion";
import { Flag, ClipboardList } from "lucide-react";
import { Priority, TaskStatus } from "@/types/enums/enums";

const PriorityStatusFields = ({
  formData,
  handleInputChange,
  getPriorityColor,
  isPending,
  isOwner,
}: {
  formData: { priority: Priority; status: TaskStatus };
  handleInputChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  getPriorityColor: (priority: Priority) => string;
  isPending: boolean;
  isOwner: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className={`grid grid-cols-1 ${isOwner ? 'md:grid-cols-2' : 'grid-cols-1'} gap-4`}
  >
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-base-content">
        <Flag size={16} className={getPriorityColor(formData.priority)} />
        Priority
      </label>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleInputChange}
          disabled={isPending}
          className="select select-bordered w-full bg-base-200 border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
        >
          <option value={Priority.LOW}>Low</option>
          <option value={Priority.MEDIUM}>Medium</option>
          <option value={Priority.HIGH}>High</option>
        </select>
      </motion.div>
    </div>
    {isOwner && (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-base-content">
          <ClipboardList size={16} className="text-info" />
          Status
        </label>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <select
            name="status"
            value={formData.status}
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
    )}
  </motion.div>
);

export default PriorityStatusFields;