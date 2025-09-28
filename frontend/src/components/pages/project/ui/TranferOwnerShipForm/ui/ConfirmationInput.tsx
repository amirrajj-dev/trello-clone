import { motion, AnimatePresence } from "framer-motion";
import { Shield, AlertTriangle } from "lucide-react";

const ConfirmationInput = ({
  confirmationText,
  setConfirmationText,
}: {
  confirmationText: string;
  setConfirmationText: (value: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.5 }}
    className="space-y-3"
  >
    <label className="flex items-center gap-2 text-sm font-medium text-base-content">
      <Shield size={16} className="text-error" />
      Type <code className="bg-error/20 text-error px-2 py-1 rounded text-xs">transfer ownership</code> to confirm
    </label>
    <motion.div whileHover={{ scale: 1.01 }}>
      <input
        type="text"
        placeholder="Type exactly: transfer ownership"
        value={confirmationText}
        onChange={(e) => setConfirmationText(e.target.value)}
        className={`input w-full bg-base-200 border-base-300 rounded-xl focus:outline-none transition-all duration-200 h-12 px-4 ${
          confirmationText.length > 0
            ? confirmationText === "transfer ownership"
              ? "border-success focus:ring-2 focus:ring-success/20"
              : "border-error focus:ring-2 focus:ring-error/20"
            : "focus:ring-2 focus:ring-warning/20 focus:border-warning"
        }`}
      />
    </motion.div>
    <AnimatePresence>
      {confirmationText.length > 0 && confirmationText !== "transfer ownership" && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-error text-xs flex items-center gap-1"
        >
          <AlertTriangle size={10} />
          Must match exactly: "transfer ownership"
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
);

export default ConfirmationInput;