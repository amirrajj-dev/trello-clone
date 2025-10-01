import React from "react";
import { motion } from "framer-motion";
import { useGetUserTasks } from "@/hooks/queries/tasks";
import { List } from "lucide-react";
import TaskCard from "@/components/common/taskCard/TaskCard";
import { Task } from "@/types/interfaces/interfaces";
import { toast } from "sonner";
import { useGetMe } from "@/hooks/queries/user";

const TasksSection = () => {
  const {
    data: tasksData,
    isLoading: tasksLoading,
    error: tasksError,
  } = useGetUserTasks();
  const tasks = tasksData?.data;
  if (tasksError) {
    toast.error(tasksError.message || "Failed to load tasks");
  }
  const { data: user } = useGetMe();
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mb-8"
    >
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-2xl font-bold mb-6 flex items-center gap-3 group"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl"
        >
          <List size={22} className="text-accent" />
          <motion.div
            whileHover={{ scale: 1.2, rotate: 180 }}
            className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"
          />
        </motion.div>
        <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Your Tasks
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-accent/30 to-transparent ml-4"></div>
      </motion.h2>
      {tasksLoading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      ) : tasks?.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center text-base-content/70"
        >
          No tasks assigned to you yet.
        </motion.p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.slice(0, 6).map((task: Task) => (
            <TaskCard
            projectId={task.projectId}
              key={task.id}
              task={task}
              currentUserId={user?.id || ""}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default TasksSection;
