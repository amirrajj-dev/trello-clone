import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const FinalConfirmation = ({
  isFormValid,
  selectedMember,
}: {
  isFormValid: boolean | string;
  selectedMember: { user: { id: string; name: string; email: string; avatarUrl?: string }; role: string } | undefined;
}) => (
  <AnimatePresence>
    {isFormValid && (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="p-4 bg-error/10 border border-error/20 rounded-xl"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle size={20} className="text-error flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-error text-sm mb-1">Final Confirmation</h4>
            <p className="text-error/80 text-sm">
              You are about to transfer ownership to <strong>{selectedMember?.user.name}</strong>. 
              You will lose ownership privileges and this action is permanent.
            </p>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default FinalConfirmation;