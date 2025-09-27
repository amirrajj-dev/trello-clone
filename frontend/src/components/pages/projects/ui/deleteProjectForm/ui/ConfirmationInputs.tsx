import { motion, AnimatePresence } from "framer-motion";
import { Lock, Shield, AlertTriangle } from "lucide-react";

const ConfirmationInputs = ({
  projectName,
  deleteMyProject,
  setDeleteMyProject,
  projectTitle,
  setProjectTitle,
}: {
  projectName: string;
  deleteMyProject: string;
  setDeleteMyProject: (value: string) => void;
  projectTitle: string;
  setProjectTitle: (value: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4 }}
    className="space-y-4"
  >
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-base-content">
        <Lock size={14} className="text-error" />
        Type{" "}
        <code className="bg-error/20 text-error px-2 py-1 rounded text-xs">
          delete my project
        </code>{" "}
        to continue
      </label>
      <motion.div whileHover={{ scale: 1.01 }}>
        <input
          type="text"
          value={deleteMyProject}
          onChange={(e) => setDeleteMyProject(e.target.value)}
          className={`input w-full bg-base-200 border-base-300 rounded-xl focus:outline-none transition-all duration-200 h-12 px-4 ${
            deleteMyProject.length > 0
              ? deleteMyProject.toLowerCase() === "delete my project"
                ? "border-success focus:ring-2 focus:ring-success/20"
                : "border-error focus:ring-2 focus:ring-error/20"
              : "focus:ring-2 focus:ring-error/20 focus:border-error"
          }`}
          placeholder="Type exactly: delete my project"
        />
      </motion.div>
      <AnimatePresence>
        {deleteMyProject.length > 0 &&
          deleteMyProject.toLowerCase() !== "delete my project" && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-error text-xs flex items-center gap-1"
            >
              <AlertTriangle size={10} />
              Must match exactly: "delete my project"
            </motion.p>
          )}
      </AnimatePresence>
    </div>
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-base-content">
        <Shield size={14} className="text-error" />
        Type the project name:{" "}
        <strong className="text-error">"{projectName}"</strong>
      </label>
      <motion.div whileHover={{ scale: 1.01 }}>
        <input
          type="text"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          className={`input w-full bg-base-200 border-base-300 rounded-xl focus:outline-none transition-all duration-200 h-12 px-4 ${
            projectTitle.length > 0
              ? projectTitle.toLowerCase() === projectName.toLowerCase()
                ? "border-success focus:ring-2 focus:ring-success/20"
                : "border-error focus:ring-2 focus:ring-error/20"
              : "focus:ring-2 focus:ring-error/20 focus:border-error"
          }`}
          placeholder={`Type: ${projectName}`}
        />
      </motion.div>
      <AnimatePresence>
        {projectTitle.length > 0 &&
          projectTitle.toLowerCase() !== projectName.toLowerCase() && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-error text-xs flex items-center gap-1"
            >
              <AlertTriangle size={10} />
              Must match project name exactly
            </motion.p>
          )}
      </AnimatePresence>
    </div>
  </motion.div>
);

export default ConfirmationInputs;