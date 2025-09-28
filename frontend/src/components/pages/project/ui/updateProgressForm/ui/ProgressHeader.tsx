import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const ProgressHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="text-center"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: "spring" }}
      className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl mb-4"
    >
      <TrendingUp size={28} className="text-primary" />
    </motion.div>
    <h3 className="text-xl font-bold text-base-content mb-2">
      Update Progress
    </h3>
    <p className="text-base-content/60 text-sm">
      Track your task completion status
    </p>
  </motion.div>
);

export default ProgressHeader;