import { motion } from "framer-motion";

const CurrentProgressDisplay = ({
  currentProgress,
  getProgressColor,
  getProgressLabel,
}: {
  currentProgress: number;
  getProgressColor: (value: number) => string;
  getProgressLabel: (value: number) => string;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 }}
    className="p-4 bg-base-200/50 rounded-xl border border-base-300"
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium text-base-content">Current Progress</span>
      <span className={`text-lg font-bold ${getProgressColor(currentProgress)}`}>
        {currentProgress}%
      </span>
    </div>
    <div className="w-full bg-base-300 rounded-full h-3">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${currentProgress}%` }}
        transition={{ duration: 1, delay: 0.4 }}
        className={`h-3 rounded-full ${getProgressColor(currentProgress).replace('text-', 'bg-')}`}
      />
    </div>
    <p className="text-xs text-base-content/60 mt-2 text-center">
      {getProgressLabel(currentProgress)}
    </p>
  </motion.div>
);

export default CurrentProgressDisplay;