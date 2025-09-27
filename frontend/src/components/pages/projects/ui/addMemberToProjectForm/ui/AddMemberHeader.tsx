import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

const AddMemberHeader = ({
  projectName,
}: {
  projectName: string;
}) => (
  <div className="text-center mb-2">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.1, type: "spring" }}
      className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl mb-3"
    >
      <UserPlus size={24} className="text-primary" />
    </motion.div>
    <h3 className="text-lg font-semibold text-base-content">
      Add Team Member
    </h3>
    <p className="text-base-content/60 text-sm">
      Add someone to{" "}
      <span className="font-medium text-primary">"{projectName}"</span>
    </p>
  </div>
);

export default AddMemberHeader;