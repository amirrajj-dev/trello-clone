import { motion } from "framer-motion";
import { Edit } from "lucide-react";

const TaskFormHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="text-center"
  >
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-warning/20 to-info/20 rounded-2xl mb-4"
    >
      <Edit size={28} className="text-warning" />
    </motion.div>
    <h3 className="text-xl font-bold text-base-content mb-2">Update Task</h3>
    <p className="text-base-content/60 text-sm">
      Modify task details and track progress
    </p>
  </motion.div>
);

export default TaskFormHeader;