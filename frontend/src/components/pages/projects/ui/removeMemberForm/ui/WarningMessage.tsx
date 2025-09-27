import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const WarningMessage = ({
  selectedMember,
}: {
  selectedMember:
    | {
        user: {
          name: string;
          avatarUrl: string | null;
          id: string;
        };
      }
    | undefined;
}) => (
  <AnimatePresence>
    {selectedMember && (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="p-4 bg-error/10 border border-error/20 rounded-xl"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle
            size={20}
            className="text-error mt-0.5 flex-shrink-0"
          />
          <div className="space-y-2">
            <h4 className="font-semibold text-error text-sm">
              Warning: This action is permanent
            </h4>
            <p className="text-error/80 text-sm">
              You are about to remove{" "}
              <strong className="text-error">{selectedMember.user.name}</strong>{" "}
              from this project. They will immediately lose access to all project
              content and this action cannot be undone.
            </p>
            <ul className="text-error/70 text-xs space-y-1">
              <li>• All their task assignments will be removed</li>
              <li>• They will lose access to project files</li>
              <li>• Project history will be preserved</li>
            </ul>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default WarningMessage;