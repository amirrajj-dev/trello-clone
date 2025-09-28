import { motion } from "framer-motion";
import { AlertTriangle, Crown, Shield } from "lucide-react";

const CriticalWarning = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.3 }}
    className="p-4 bg-warning/10 border border-warning/20 rounded-xl"
  >
    <div className="flex items-start gap-3">
      <AlertTriangle size={20} className="text-warning mt-0.5 flex-shrink-0" />
      <div className="space-y-2">
        <h4 className="font-semibold text-warning text-sm">Important Notice</h4>
        <p className="text-warning/80 text-sm">
          You are about to transfer project ownership. This action will:
        </p>
        <ul className="text-warning/70 text-xs space-y-1">
          <li className="flex items-center gap-2">
            <Crown size={12} />
            <span>Make you a admin project member</span>
          </li>
          <li className="flex items-center gap-2">
            <Shield size={12} />
            <span>Give full control to the new owner</span>
          </li>
          <li className="flex items-center gap-2">
            <AlertTriangle size={12} />
            <span>This action cannot be undone</span>
          </li>
        </ul>
      </div>
    </div>
  </motion.div>
);

export default CriticalWarning;