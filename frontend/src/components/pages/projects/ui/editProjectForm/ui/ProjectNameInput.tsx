import { motion, AnimatePresence } from "framer-motion";
import { Folder, Sparkles } from "lucide-react";

const ProjectNameInput = ({
  name,
  setName,
  originalName,
}: {
  name: string;
  setName: (value: string) => void;
  originalName: string;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 }}
    className="space-y-2"
  >
    <label className="flex items-center gap-2 text-sm font-medium text-base-content">
      <Folder size={16} className="text-primary" />
      Project Name *
    </label>
    <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
      <input
        type="text"
        placeholder="Enter project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input input-bordered w-full bg-base-200 border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 h-12 px-4"
        maxLength={40}
      />
    </motion.div>
    <div className="flex justify-between text-xs text-base-content/40">
      <span>Current: {originalName}</span>
      <span>{name.length}/40</span>
    </div>
    <AnimatePresence>
      {name !== originalName && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-2 text-success text-xs bg-success/10 p-2 rounded-lg"
        >
          <Sparkles size={12} />
          <span>Name will be updated</span>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default ProjectNameInput;