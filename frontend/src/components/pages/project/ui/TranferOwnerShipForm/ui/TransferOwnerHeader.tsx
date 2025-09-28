import { motion } from "framer-motion";
import { Crown } from "lucide-react";

const TransferOwnerHeader = () => (
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
      className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-warning/20 to-amber-500/20 rounded-2xl mb-4"
    >
      <Crown size={28} className="text-warning" />
    </motion.div>
    <h3 className="text-xl font-bold text-warning mb-2">
      Transfer Project Ownership
    </h3>
    <p className="text-base-content/60 text-sm">
      Transfer project ownership to another team member
    </p>
  </motion.div>
);

export default TransferOwnerHeader;