import { motion } from "framer-motion";
import { Edit } from "lucide-react";

const EditProjectHeader = () => (
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
      className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-warning/20 to-amber-500/20 rounded-2xl mb-4"
    >
      <Edit size={28} className="text-warning" />
    </motion.div>
    <h3 className="text-xl font-bold text-base-content mb-2">
      Edit Project
    </h3>
    <p className="text-base-content/60 text-sm">
      Update your project details and description
    </p>
  </motion.div>
);

export default EditProjectHeader;