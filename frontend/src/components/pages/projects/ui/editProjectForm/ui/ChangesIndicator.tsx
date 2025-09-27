import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";

const ChangesIndicator = ({
  hasChanges,
  handleReset,
}: {
  hasChanges: boolean;
  handleReset: () => void;
}) => (
  <AnimatePresence>
    {hasChanges && (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="flex items-center justify-between p-3 bg-warning/10 border border-warning/20 rounded-xl"
      >
        <div className="flex items-center gap-2 text-warning text-sm">
          <RefreshCw size={14} />
          <span>You have unsaved changes</span>
        </div>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="text-warning hover:text-warning/80 text-xs font-medium px-2 py-1 rounded-lg hover:bg-warning/10 transition-all"
        >
          Reset
        </motion.button>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ChangesIndicator;