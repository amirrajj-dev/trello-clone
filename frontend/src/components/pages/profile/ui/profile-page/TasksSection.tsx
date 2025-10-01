import { motion } from "framer-motion";
import { Target } from "lucide-react";
import TaskCard from "@/components/common/taskCard/TaskCard";
import { Task } from "@/types/interfaces/interfaces";

interface TasksSectionProps {
  tasksLoading: boolean;
  tasks: Task[];
  userId: string;
}

const TasksSection = ({
  tasksLoading,
  tasks,
  userId,
}: TasksSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.5 }}
  >
    <h2 className="text-2xl font-bold text-base-content mb-6 flex items-center gap-3">
      <Target size={28} className="text-primary" />
      Your Recent Tasks
      <span className="text-base-content/60 text-lg font-normal">
        ({tasks.length})
      </span>
    </h2>
    {tasksLoading ? (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-base-content/60">Loading tasks...</p>
        </div>
      </div>
    ) : tasks.length === 0 ? (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 bg-base-200/50 rounded-2xl border border-dashed border-base-300"
      >
        <Target size={48} className="mx-auto text-base-content/20 mb-4" />
        <h3 className="text-lg font-semibold text-base-content mb-2">
          No tasks assigned
        </h3>
        <p className="text-base-content/60">
          You don't have any tasks assigned to you yet
        </p>
      </motion.div>
    ) : (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {tasks.slice(0, 6).map((task: Task) => (
          <TaskCard
            task={task}
            currentUserId={userId}
            projectId={task.projectId}
            key={task.id}
          />
        ))}
      </motion.div>
    )}
  </motion.div>
);

export default TasksSection;