import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

const DeleteTaskHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="text-center mb-6"
  >
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-error/20 to-error/10 rounded-2xl mb-4 border border-error/20"
    >
      <Trash2 size={32} className="text-error" />
    </motion.div>
    <h3 className="text-xl font-bold text-base-content mb-2">Delete Task</h3>
    <p className="text-base-content/60 text-sm">This action cannot be undone</p>
  </motion.div>
);

export default DeleteTaskHeader;