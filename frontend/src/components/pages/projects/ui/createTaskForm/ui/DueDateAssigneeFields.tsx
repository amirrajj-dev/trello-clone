import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, AlertCircle } from "lucide-react";

const DueDateAssigneeFields = ({
  dueDate,
  assigneeId,
  handleInputChange,
  errors,
  isPending,
  projectMembers,
  getMinDate,
}: {
  dueDate: string;
  assigneeId: string;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  errors: Record<string, string>;
  isPending: boolean;
  projectMembers: {
    user: {
      name: string;
      avatarUrl: string | null;
      id: string;
    };
  }[];
  getMinDate: () => string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
    className="grid grid-cols-1 md:grid-cols-2 gap-4"
  >
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-base-content">
        <Calendar size={16} className="text-warning" />
        Due Date
      </label>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <input
          type="date"
          name="dueDate"
          value={dueDate}
          onChange={handleInputChange}
          min={getMinDate()}
          disabled={isPending}
          className={`input input-bordered w-full bg-base-200 border-base-300 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
            errors.dueDate
              ? "input-error focus:ring-error/20 focus:border-error"
              : "focus:ring-primary/20 focus:border-primary"
          }`}
        />
      </motion.div>
      <AnimatePresence>
        {errors.dueDate && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-error text-xs flex items-center gap-1"
          >
            <AlertCircle size={12} />
            {errors.dueDate}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-base-content">
        <User size={16} className="text-success" />
        Assignee
      </label>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <select
          name="assigneeId"
          value={assigneeId}
          onChange={handleInputChange}
          disabled={isPending}
          className="select select-bordered w-full bg-base-200 border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
        >
          <option value="">Unassigned</option>
          {projectMembers?.map((member) => (
            <option key={member.user.id} value={member.user.id}>
              {member.user.name}
            </option>
          ))}
        </select>
      </motion.div>
    </div>
  </motion.div>
);

export default DueDateAssigneeFields;