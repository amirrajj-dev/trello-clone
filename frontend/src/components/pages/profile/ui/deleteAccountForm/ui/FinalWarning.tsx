import { motion, AnimatePresence } from "framer-motion";
import { Skull } from "lucide-react";

const FinalWarning = ({ isValid }: { isValid: boolean }) => (
  <AnimatePresence>
    {isValid && (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="p-4 bg-error/20 border border-error/30 rounded-xl"
      >
        <div className="flex items-center gap-3">
          <Skull size={20} className="text-error flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-error text-sm mb-1">Final Warning</h4>
            <p className="text-error/80 text-sm">
              All validations passed. Your account will be permanently deleted immediately after confirmation.
              This action cannot be reversed.
            </p>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default FinalWarning;