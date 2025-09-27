import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const FormCharacterCounter = ({ nameLength }: { nameLength: number }) => (
  <AnimatePresence>
    {nameLength > 80 && (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="flex items-center gap-2 text-amber-500 text-xs bg-amber-500/10 p-2 rounded-lg"
      >
        <Sparkles size={12} />
        <span>Project name is getting long</span>
      </motion.div>
    )}
  </AnimatePresence>
);

export default FormCharacterCounter;