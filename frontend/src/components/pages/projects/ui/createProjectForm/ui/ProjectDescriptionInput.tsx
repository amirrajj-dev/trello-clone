import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const ProjectDescriptionInput = ({
  description,
  setDescription,
  isPending,
}: {
  description: string;
  setDescription: (value: string) => void;
  isPending: boolean;
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
        disabled={isPending}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="textarea textarea-bordered w-full bg-base-200 border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none min-h-[100px] p-4"
        maxLength={200}
      />
    </motion.div>
    <div className="flex justify-between text-xs text-base-content/40">
      <span>What's this project about?</span>
      <span>{description.length}/200</span>
    </div>
  </motion.div>
);

export default ProjectDescriptionInput;