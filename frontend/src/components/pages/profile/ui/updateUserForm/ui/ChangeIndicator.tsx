import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const ChangeIndicator = ({ hasChanges }: { hasChanges: boolean }) => (
  <AnimatePresence>
    {hasChanges && (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="p-3 bg-primary/10 border border-primary/20 rounded-xl"
      >
        <div className="flex items-center gap-2 text-primary text-sm">
          <Sparkles size={14} />
          <span>You have unsaved changes to your profile</span>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ChangeIndicator;