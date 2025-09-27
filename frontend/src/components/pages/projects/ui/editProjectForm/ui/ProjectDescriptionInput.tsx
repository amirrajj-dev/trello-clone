import { motion, AnimatePresence } from "framer-motion";
import { FileText, Edit } from "lucide-react";

const ProjectDescriptionInput = ({
  description,
  setDescription,
  originalDescription,
}: {
  description: string;
  setDescription: (value: string) => void;
  originalDescription: string;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4 }}
    className="space-y-2"
  >
    <label className="flex items-center gap-2 text-sm font-medium text-base-content">
      <FileText size={16} className="text-secondary" />
      Description
      <span className="text-base-content/40 text-xs font-normal">
        (optional)
      </span>
    </label>
    <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
      <textarea
        placeholder="Describe your project goals, objectives, or any important details..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="textarea textarea-bordered w-full bg-base-200 border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none min-h-[100px] p-4"
        maxLength={200}
      />
    </motion.div>
    <div className="flex justify-between text-xs text-base-content/40">
      <span>Current: {originalDescription || "No description"}</span>
      <span>{description.length}/200</span>
    </div>
    <AnimatePresence>
      {description !== originalDescription && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-2 text-info text-xs bg-info/10 p-2 rounded-lg"
        >
          <Edit size={12} />
          <span>Description will be updated</span>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default ProjectDescriptionInput;