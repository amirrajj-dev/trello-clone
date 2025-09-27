import { motion, AnimatePresence } from "framer-motion";

const ValidationSuccess = ({ isValid }: { isValid: boolean }) => (
  <AnimatePresence>
    {isValid && (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="p-3 bg-error/20 border border-error/30 rounded-lg"
      >
        <p className="text-error text-sm text-center font-medium">
          ⚠️ All validations passed. Project deletion is now enabled.
        </p>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ValidationSuccess;