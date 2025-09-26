'use client'
import { Project } from "@/types/interfaces/interfaces";
import { motion } from "framer-motion";

const ProjectCardProgress = ({
  project,
}: {
  project: Project;
}) => {
  const completionPercentage = () => {
    if (project._count.tasks > 0) {
      const totalProgress = project.tasks.reduce(
        (prev, cur) => prev + cur.progress,
        0
      );
      return Math.round(totalProgress / project._count.tasks);
    }
    return 0;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-success";
    if (percentage >= 50) return "bg-primary";
    if (percentage >= 25) return "bg-warning";
    return "bg-error";
  };

  return (
    <div className="mb-4 relative z-0">
      <div className="flex justify-between text-xs text-base-content/60 mb-2">
        <span>Project progress</span>
        <span>{completionPercentage()}%</span>
      </div>
      <div className="w-full bg-base-300 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${completionPercentage()}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`h-2 rounded-full ${getProgressColor(completionPercentage())}`}
        />
      </div>
    </div>
  );
};

export default ProjectCardProgress