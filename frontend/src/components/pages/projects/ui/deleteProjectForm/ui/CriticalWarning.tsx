import { motion } from "framer-motion";
import { AlertTriangle, Archive, Shield, Lock } from "lucide-react";

const CriticalWarning = ({ projectName }: { projectName: string }) => (
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
          You are about to permanently delete{" "}
          <strong className="text-error">"{projectName}"</strong> and all of its
          contents.
        </p>
        <ul className="text-error/70 text-xs space-y-1">
          <li className="flex items-center gap-2">
            <Archive size={12} />
            <span>All tasks, comments, and files will be deleted</span>
          </li>
          <li className="flex items-center gap-2">
            <Shield size={12} />
            <span>All member access will be revoked immediately</span>
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