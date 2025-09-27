import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const ProjectNameInput = ({
  name,
  setName,
  isPending,
}: {
  name: string;
  setName: (value: string) => void;
  isPending: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 }}
    className="space-y-2"
  >
    <label className="flex items-center gap-2 text-sm font-medium text-base-content">
      <Sparkles size={16} className="text-primary" />
      Project Name *
    </label>
    <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
      <input
        type="text"
        placeholder="e.g., Marketing Campaign, Product Launch..."
        disabled={isPending}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input input-bordered w-full bg-base-200 border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 h-12 px-4"
        maxLength={40}
      />
    </motion.div>
    <div className="flex justify-between text-xs text-base-content/40">
      <span>This will be your project's identity</span>
      <span>{name.length}/40</span>
    </div>
  </motion.div>
);

export default ProjectNameInput;