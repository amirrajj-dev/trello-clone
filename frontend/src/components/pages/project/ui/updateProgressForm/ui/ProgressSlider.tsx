import { motion } from "framer-motion";
import { Target, TrendingUp } from "lucide-react";

const ProgressSlider = ({
  progress,
  setProgress,
  getProgressColor,
  getProgressLabel,
}: {
  progress: number;
  setProgress: (value: number) => void;
  getProgressColor: (value: number) => string;
  getProgressLabel: (value: number) => string;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4 }}
    className="space-y-4"
  >
    <label className="flex items-center gap-2 text-sm font-medium text-base-content">
      <Target size={16} className="text-secondary" />
      Set New Progress
    </label>
    <div className="space-y-6">
      <motion.div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="range range-primary w-full h-3"
        />
        <div className="flex justify-between text-xs text-base-content/40 px-2 mt-2">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </motion.div>
      <motion.div
        className="flex items-center justify-between p-4 bg-base-200 rounded-xl border border-base-300"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getProgressColor(progress).replace('text-', 'bg-')}/20`}>
            <TrendingUp size={20} className={getProgressColor(progress)} />
          </div>
          <div>
            <p className="font-semibold text-base-content">New Progress</p>
            <p className="text-sm text-base-content/60">{getProgressLabel(progress)}</p>
          </div>
        </div>
        <motion.span
          className={`text-2xl font-bold ${getProgressColor(progress)}`}
          key={progress}
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          {progress}%
        </motion.span>
      </motion.div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-base-content/70">Preview:</span>
          <span className={`font-medium ${getProgressColor(progress)}`}>
            {progress}% Complete
          </span>
        </div>
        <div className="w-full bg-base-300 rounded-full h-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, type: "spring" }}
            className={`h-4 rounded-full ${getProgressColor(progress).replace('text-', 'bg-')} relative overflow-hidden`}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12"
              animate={{ x: ["0%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default ProgressSlider;