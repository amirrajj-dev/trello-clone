import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const AdditionalWarning = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4 }}
    className="flex items-center gap-2 text-warning text-sm bg-warning/10 rounded-lg p-3 mb-6 border border-warning/20"
  >
    <Shield size={16} />
    <span>This action is irreversible. Please confirm carefully.</span>
  </motion.div>
);

export default AdditionalWarning;