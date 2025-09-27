import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

const DeleteProjectHeader = () => (
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
      className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-error/20 to-red-600/20 rounded-2xl mb-4"
    >
      <Trash2 size={28} className="text-error" />
    </motion.div>
    <h3 className="text-xl font-bold text-error mb-2">
      Delete Project Permanently
    </h3>
    <p className="text-base-content/60 text-sm">
      This action cannot be undone. Please confirm carefully.
    </p>
  </motion.div>
);

export default DeleteProjectHeader;