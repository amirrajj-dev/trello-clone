import { motion, AnimatePresence } from "framer-motion";
import { Skull } from "lucide-react";

const AttemptsWarning = ({ attempts }: { attempts: number }) => {
  const getWarningLevel = () => {
    if (attempts >= 3) return "high";
    if (attempts >= 1) return "medium";
    return "low";
  };

  const warningLevel = getWarningLevel();

  return (
    <AnimatePresence>
      {attempts > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className={`p-3 rounded-lg border ${
            warningLevel === "high"
              ? "bg-error/20 border-error/30"
              : "bg-warning/20 border-warning/30"
          }`}
        >
          <div className="flex items-center gap-2 text-sm">
            <Skull
              size={16}
              className={warningLevel === "high" ? "text-error" : "text-warning"}
            />
            <span
              className={warningLevel === "high" ? "text-error" : "text-warning"}
            >
              {warningLevel === "high"
                ? "Multiple incorrect attempts detected. Please verify carefully."
                : "Incorrect confirmation detected. Please check your inputs."}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AttemptsWarning;