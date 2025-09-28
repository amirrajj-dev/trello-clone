import { motion } from "framer-motion";

const SafetyNote = ({ taskId }: { taskId: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.6 }}
    className="text-center mt-4"
  >
    <p className="text-base-content/40 text-xs">
      Task ID: {taskId.slice(0, 8)}...
    </p>
  </motion.div>
);

export default SafetyNote;