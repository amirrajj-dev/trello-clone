import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";

const ConfirmationInput = ({
  isCurrentUserOwner,
  hasRoleChanged,
  confirmationText,
  setConfirmationText,
}: {
  isCurrentUserOwner: boolean;
  hasRoleChanged: boolean;
  confirmationText: string;
  setConfirmationText: (value: string) => void;
}) => (
  <AnimatePresence>
    {!isCurrentUserOwner && hasRoleChanged && (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        <label className="flex items-center gap-2 text-sm font-medium text-base-content">
          <Shield size={16} className="text-warning" />
          Type <code className="bg-warning/20 text-warning px-2 py-1 rounded text-xs">change role</code> to confirm
        </label>
        <motion.div whileHover={{ scale: 1.01 }}>
          <input
            type="text"
            placeholder="Type exactly: change role"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            className={`input w-full bg-base-200 border-base-300 rounded-xl focus:outline-none transition-all duration-200 h-12 px-4 ${
              confirmationText.length > 0
                ? confirmationText === "change role"
                  ? "border-success focus:ring-2 focus:ring-success/20"
                  : "border-error focus:ring-2 focus:ring-error/20"
                : "focus:ring-2 focus:ring-warning/20 focus:border-warning"
            }`}
          />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ConfirmationInput;