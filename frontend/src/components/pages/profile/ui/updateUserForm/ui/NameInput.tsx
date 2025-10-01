import { motion, AnimatePresence } from "framer-motion";
import { User, Sparkles } from "lucide-react";

const NameInput = ({
  name,
  setName,
}: {
  name: string;
  setName: (value: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4 }}
    className="space-y-2"
  >
    <label className="flex items-center gap-2 text-sm font-medium text-base-content">
      <User size={16} className="text-primary" />
      Full Name *
    </label>
    <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
      <input
        type="text"
        placeholder="Enter your full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input input-bordered w-full bg-base-200 border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 h-12 px-4"
        minLength={6}
        maxLength={30}
      />
    </motion.div>
    <div className="flex justify-between text-xs text-base-content/40">
      <span>Must be 6-30 characters</span>
      <span>{name.length}/30</span>
    </div>
    <AnimatePresence>
      {name.length > 0 && name.length < 6 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-2 text-warning text-sm bg-warning/10 p-2 rounded-lg"
        >
          <Sparkles size={12} />
          Name must be at least 6 characters long
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default NameInput;