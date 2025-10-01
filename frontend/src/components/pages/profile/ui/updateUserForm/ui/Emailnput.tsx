import { motion } from "framer-motion";
import { Mail } from "lucide-react";

const EmailInput = ({
  email,
  setEmail,
}: {
  email: string;
  setEmail: (value: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.5 }}
    className="space-y-2"
  >
    <label className="flex items-center gap-2 text-sm font-medium text-base-content">
      <Mail size={16} className="text-secondary" />
      Email Address *
    </label>
    <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input input-bordered w-full bg-base-200 border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 h-12 px-4"
      />
    </motion.div>
  </motion.div>
);

export default EmailInput;