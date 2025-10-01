import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Loader } from "lucide-react";

const FormActions = ({
  isPending,
  isValid,
  closeModal,
}: {
  isPending: boolean;
  isValid: boolean;
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
      whileHover={{ scale: isValid ? 1.02 : 1 }}
      whileTap={{ scale: isValid ? 0.98 : 1 }}
      className="btn btn-error flex-1 rounded-xl bg-gradient-to-r from-error to-red-600 hover:from-error/90 hover:to-red-600/90 text-error-content shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30 relative overflow-hidden"
      disabled={isPending || !isValid}
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
            Deleting...
          </motion.div>
        ) : (
          <motion.div
            key="delete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete Account Permanently
          </motion.div>
        )}
      </AnimatePresence>
      {isValid && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-error-content/20 to-transparent transform -skew-x-12"
          initial={{ x: "-100%" }}
          whileHover={{ x: "200%" }}
          transition={{ duration: 0.8 }}
        />
      )}
    </motion.button>
  </motion.div>
);

export default FormActions;