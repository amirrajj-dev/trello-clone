import { Task } from "@/types/interfaces/interfaces";
import { motion } from "framer-motion";

const TaskCardProgress = ({ task }: { task: Task }) => {
  if (task.status !== "IN_PROGRESS" || task.progress === undefined) return null;

  return (
    <div className="mt-4 relative z-0">
      <div className="flex justify-between text-xs text-base-content/60 mb-1">
        <span>Progress</span>
        <span>{task.progress}%</span>
      </div>
      <div className="w-full bg-base-300 rounded-full h-1.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${task.progress}%` }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-primary h-1.5 rounded-full"
        />
      </div>
    </div>
  );
};

export default TaskCardProgress;