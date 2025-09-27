import { motion, AnimatePresence } from "framer-motion";
import { UserX, Loader } from "lucide-react";

const FormActions = ({
  isFormValid,
  isPending,
  handleRemoveUserFromProject,
  closeModal,
}: {
  isFormValid: boolean;
  isPending: boolean;
  handleRemoveUserFromProject: () => void;
  closeModal: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
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
      type="button"
      whileHover={{ scale: isFormValid ? 1.02 : 1 }}
      whileTap={{ scale: isFormValid ? 0.98 : 1 }}
      onClick={handleRemoveUserFromProject}
      className="btn btn-error flex-1 rounded-xl bg-gradient-to-r from-error to-red-600 hover:from-error/90 hover:to-red-600/90 text-error-content shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 relative overflow-hidden"
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
            Removing...
          </motion.div>
        ) : (
          <motion.div
            key="remove"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <UserX size={16} />
            Remove Member
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-error-content/20 to-transparent transform -skew-x-12"
        initial={{ x: "-100%" }}
        whileHover={{ x: "200%" }}
        transition={{ duration: 0.8 }}
      />
    </motion.button>
  </motion.div>
);

export default FormActions;