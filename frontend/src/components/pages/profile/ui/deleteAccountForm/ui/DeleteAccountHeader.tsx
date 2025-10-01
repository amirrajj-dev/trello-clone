import { motion } from "framer-motion";
import { UserX } from "lucide-react";

const DeleteAccountHeader = () => (
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
      <UserX size={28} className="text-error" />
    </motion.div>
    <h3 className="text-xl font-bold text-error mb-2">
      Delete Your Account
    </h3>
    <p className="text-base-content/60 text-sm">
      This action is permanent and cannot be undone
    </p>
  </motion.div>
);

export default DeleteAccountHeader;