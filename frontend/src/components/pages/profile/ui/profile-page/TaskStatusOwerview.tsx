import { motion } from "framer-motion";
import { Award, BarChart2, Calendar, TrendingUp } from "lucide-react";

interface TaskStatusOverviewProps {
  tasksLoading: boolean;
  taskStatusCounts: { TODO: number; IN_PROGRESS: number; DONE: number };
  totalTasks: number;
}

const TaskStatusOverview = ({
  tasksLoading,
  taskStatusCounts,
  totalTasks,
}: TaskStatusOverviewProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    className="mb-8"
  >
    <h2 className="text-2xl font-bold text-base-content mb-6 flex items-center gap-3">
      <BarChart2 size={28} className="text-primary" />
      Task Status Overview
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
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            status: "TODO",
            count: taskStatusCounts.TODO,
            color: "bg-primary",
            text: "text-primary",
            icon: Calendar,
          },
          {
            status: "IN_PROGRESS",
            count: taskStatusCounts.IN_PROGRESS,
            color: "bg-warning",
            text: "text-warning",
            icon: TrendingUp,
          },
          {
            status: "DONE",
            count: taskStatusCounts.DONE,
            color: "bg-success",
            text: "text-success",
            icon: Award,
          },
        ].map((item, index) => (
          <motion.div
            key={item.status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-base-200/80 backdrop-blur-sm rounded-2xl p-6 border border-base-300/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${item.color}/20`}>
                <item.icon size={24} className={item.text} />
              </div>
              <span className={`text-3xl font-bold ${item.text}`}>
                {item.count}
              </span>
            </div>
            <h3 className="font-semibold text-base-content capitalize">
              {item.status.replace("_", " ").toLowerCase()}
            </h3>
            <p className="text-base-content/60 text-sm mt-1">
              {totalTasks > 0
                ? Math.round((item.count / totalTasks) * 100)
                : 0}
              % of total tasks
            </p>
          </motion.div>
        ))}
      </div>
    )}
  </motion.div>
);

export default TaskStatusOverview;