import { motion } from "framer-motion";
import { Folder, Target, TrendingUp, Award } from "lucide-react";

interface StatsOverviewProps {
  projectsLength: number;
  totalTasks: number;
  completionRate: number;
  doneTasks: number;
}

const StatsOverview = ({
  projectsLength,
  totalTasks,
  completionRate,
  doneTasks,
}: StatsOverviewProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
  >
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className="bg-base-200/80 backdrop-blur-sm rounded-2xl p-6 border border-base-300/50 text-center"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-xl mb-3">
        <Folder size={24} className="text-primary" />
      </div>
      <h3 className="text-2xl font-bold text-base-content mb-1">
        {projectsLength}
      </h3>
      <p className="text-base-content/60 text-sm">Projects</p>
    </motion.div>
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className="bg-base-200/80 backdrop-blur-sm rounded-2xl p-6 border border-base-300/50 text-center"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary/20 rounded-xl mb-3">
        <Target size={24} className="text-secondary" />
      </div>
      <h3 className="text-2xl font-bold text-base-content mb-1">
        {totalTasks}
      </h3>
      <p className="text-base-content/60 text-sm">Total Tasks</p>
    </motion.div>
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className="bg-base-200/80 backdrop-blur-sm rounded-2xl p-6 border border-base-300/50 text-center"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 bg-success/20 rounded-xl mb-3">
        <TrendingUp size={24} className="text-success" />
      </div>
      <h3 className="text-2xl font-bold text-base-content mb-1">
        {completionRate.toFixed(0)}%
      </h3>
      <p className="text-base-content/60 text-sm">Completion Rate</p>
    </motion.div>
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className="bg-base-200/80 backdrop-blur-sm rounded-2xl p-6 border border-base-300/50 text-center"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/20 rounded-xl mb-3">
        <Award size={24} className="text-accent" />
      </div>
      <h3 className="text-2xl font-bold text-base-content mb-1">
        {doneTasks}
      </h3>
      <p className="text-base-content/60 text-sm">Tasks Done</p>
    </motion.div>
  </motion.div>
);

export default StatsOverview;