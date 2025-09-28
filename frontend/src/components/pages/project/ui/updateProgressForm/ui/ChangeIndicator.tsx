import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const ChangeIndicator = ({
  hasChanged,
  currentProgress,
  progress,
}: {
  hasChanged: boolean;
  currentProgress: number;
  progress: number;
}) => (
  <AnimatePresence>
    {hasChanged && (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="p-3 bg-primary/10 border border-primary/20 rounded-xl"
      >
        <div className="flex items-center gap-2 text-primary text-sm">
          <Sparkles size={14} />
          <span>
            Progress will change from <strong>{currentProgress}%</strong> to <strong>{progress}%</strong>
          </span>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ChangeIndicator;