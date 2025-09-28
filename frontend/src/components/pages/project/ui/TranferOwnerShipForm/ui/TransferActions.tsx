import { motion, AnimatePresence } from "framer-motion";
import { Crown, Loader } from "lucide-react";

const TransferActions = ({
  isPending,
  isFormValid,
  closeModal,
}: {
  isPending: boolean;
  isFormValid: boolean | string;
  closeModal: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
    className="flex gap-3 pt-4 border-t border-base-300"
  >
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={closeModal}
      className="btn btn-ghost flex-1 rounded-xl border border-base-300 hover:bg-base-300 transition-all duration-200"
      disabled={isPending}
    >
      Cancel
    </motion.button>
    <motion.button
      type="submit"
      whileHover={{ scale: isFormValid ? 1.02 : 1 }}
      whileTap={{ scale: isFormValid ? 0.98 : 1 }}
      className="btn btn-warning flex-1 rounded-xl bg-gradient-to-r from-warning to-amber-500 hover:from-warning/90 hover:to-amber-500/90 text-warning-content shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 relative overflow-hidden"
      disabled={isPending || !isFormValid}
    >
      <AnimatePresence mode="wait">
        {isPending ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Loader size={16} className="animate-spin" />
            Transferring...
          </motion.div>
        ) : (
          <motion.div
            key="submit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Crown size={16} />
            Transfer Ownership
          </motion.div>
        )}
      </AnimatePresence>
      {isFormValid && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-warning-content/20 to-transparent transform -skew-x-12"
          initial={{ x: "-100%" }}
          whileHover={{ x: "200%" }}
          transition={{ duration: 0.8 }}
        />
      )}
    </motion.button>
  </motion.div>
);

export default TransferActions;