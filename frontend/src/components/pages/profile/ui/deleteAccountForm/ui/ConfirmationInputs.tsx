import { motion, AnimatePresence } from "framer-motion";
import { Lock, Shield, AlertTriangle } from "lucide-react";

const ConfirmationInputs = ({
  confirmationText,
  setConfirmationText,
  deleteMyAccount,
  setDeleteMyAccount,
  currentUser,
}: {
  confirmationText: string;
  setConfirmationText: (value: string) => void;
  deleteMyAccount: string;
  setDeleteMyAccount: (value: string) => void;
  currentUser: { name: string } | undefined;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.5 }}
    className="space-y-4"
  >
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-base-content">
        <Lock size={14} className="text-error" />
        Type <code className="bg-error/20 text-error px-2 py-1 rounded text-xs">delete my account</code> to continue
      </label>
      <motion.div whileHover={{ scale: 1.01 }}>
        <input
          type="text"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          className={`input w-full bg-base-200 border-base-300 rounded-xl focus:outline-none transition-all duration-200 h-12 px-4 ${
            confirmationText.length > 0
              ? confirmationText === "delete my account"
                ? "border-success focus:ring-2 focus:ring-success/20"
                : "border-error focus:ring-2 focus:ring-error/20"
              : "focus:ring-2 focus:ring-error/20 focus:border-error"
          }`}
          placeholder="Type exactly: delete my account"
        />
      </motion.div>
      <AnimatePresence>
        {confirmationText.length > 0 && confirmationText !== "delete my account" && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-error text-xs flex items-center gap-1"
          >
            <AlertTriangle size={10} />
            Must match exactly: "delete my account"
          </motion.p>
        )}
      </AnimatePresence>
    </div>
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-base-content">
        <Shield size={14} className="text-error" />
        Type your username: <strong className="text-error">"{currentUser?.name}"</strong>
      </label>
      <motion.div whileHover={{ scale: 1.01 }}>
        <input
          type="text"
          value={deleteMyAccount}
          onChange={(e) => setDeleteMyAccount(e.target.value)}
          className={`input w-full bg-base-200 border-base-300 rounded-xl focus:outline-none transition-all duration-200 h-12 px-4 ${
            deleteMyAccount.length > 0
              ? deleteMyAccount === currentUser?.name
                ? "border-success focus:ring-2 focus:ring-success/20"
                : "border-error focus:ring-2 focus:ring-error/20"
              : "focus:ring-2 focus:ring-error/20 focus:border-error"
          }`}
          placeholder={`Type: ${currentUser?.name}`}
        />
      </motion.div>
      <AnimatePresence>
        {deleteMyAccount.length > 0 && deleteMyAccount !== currentUser?.name && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-error text-xs flex items-center gap-1"
          >
            <AlertTriangle size={10} />
            Must match your username exactly
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  </motion.div>
);

export default ConfirmationInputs;