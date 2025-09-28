import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, AlertCircle } from "lucide-react";

const DescriptionField = ({
  formData,
  handleInputChange,
  errors,
  isPending,
}: {
  formData: { description?: string };
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  errors: Record<string, string>;
  isPending: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4 }}
    className="space-y-2"
  >
    <label className="flex items-center gap-2 text-sm font-medium text-base-content">
      <ClipboardList size={16} className="text-secondary" />
      Description
      <span className="text-base-content/40 text-xs font-normal">(optional)</span>
    </label>
    <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Update task description..."
        disabled={isPending}
        className={`textarea textarea-bordered w-full bg-base-200 border-base-300 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 resize-none min-h-[100px] p-4 ${
          errors.description
            ? "textarea-error focus:ring-error/20 focus:border-error"
            : "focus:ring-primary/20 focus:border-primary"
        }`}
        maxLength={120}
      />
    </motion.div>
    <div className="flex justify-between items-center">
      <AnimatePresence>
        {errors.description && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-error text-xs flex items-center gap-1"
          >
            <AlertCircle size={12} />
            {errors.description}
          </motion.span>
        )}
      </AnimatePresence>
      <span
        className={`text-xs ml-auto ${
          formData.description && formData.description.length > 100
            ? "text-warning"
            : "text-base-content/40"
        }`}
      >
        {formData.description && formData.description.length}/120
      </span>
    </div>
  </motion.div>
);

export default DescriptionField;