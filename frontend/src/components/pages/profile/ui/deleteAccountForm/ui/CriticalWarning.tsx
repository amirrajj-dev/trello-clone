import { motion } from "framer-motion";
import { AlertTriangle, Archive, Shield, Lock } from "lucide-react";

const CriticalWarning = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.3 }}
    className="p-4 bg-error/10 border border-error/20 rounded-xl"
  >
    <div className="flex items-start gap-3">
      <AlertTriangle size={20} className="text-error mt-0.5 flex-shrink-0" />
      <div className="space-y-2">
        <h4 className="font-semibold text-error text-sm">Critical Warning</h4>
        <p className="text-error/80 text-sm">
          You are about to permanently delete your account and all associated data.
        </p>
        <ul className="text-error/70 text-xs space-y-1">
          <li className="flex items-center gap-2">
            <Archive size={12} />
            <span>All your projects, tasks, and comments will be deleted</span>
          </li>
          <li className="flex items-center gap-2">
            <Shield size={12} />
            <span>You will be removed from all team projects</span>
          </li>
          <li className="flex items-center gap-2">
            <Lock size={12} />
            <span>This action is irreversible and cannot be recovered</span>
          </li>
        </ul>
      </div>
    </div>
  </motion.div>
);

export default CriticalWarning;