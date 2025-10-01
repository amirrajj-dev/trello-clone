import { motion } from "framer-motion";

const LoadingState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex justify-center items-center py-20"
  >
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
      />
      <p className="text-base-content/60">Loading project details...</p>
    </div>
  </motion.div>
);

export default LoadingState;