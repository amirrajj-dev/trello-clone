import { motion } from "framer-motion";
import { User, Edit3 } from "lucide-react";

const CommentFormHeader = ({
  isInUpdateMode,
  newComment,
}: {
  isInUpdateMode: boolean;
  newComment: string;
}) => (
  <motion.div
    className="flex items-center gap-2 text-sm font-medium text-base-content"
    animate={{ color: isInUpdateMode ? "hsl(var(--wa))" : "hsl(var(--bc))" }}
  >
    <motion.div
      animate={{
        rotate: isInUpdateMode ? 360 : 0,
        scale: isInUpdateMode ? 1.2 : 1,
      }}
      transition={{ duration: 0.3 }}
    >
      {isInUpdateMode ? (
        <Edit3 size={16} className="text-warning" />
      ) : (
        <User size={16} className="text-primary" />
      )}
    </motion.div>
    <span>{isInUpdateMode ? "Edit your comment" : "Add a comment"}</span>
    <motion.span
      className={`ml-auto text-xs px-2 py-1 rounded-full border ${
        newComment.length > 100
          ? "bg-warning/20 text-warning border-warning/30"
          : newComment.length >= 4
          ? "bg-success/20 text-success border-success/30"
          : newComment.length > 0
          ? "bg-error/20 text-error border-error/30"
          : "bg-base-300 text-base-content/60 border-base-300"
      }`}
      key={newComment.length}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500 }}
    >
      {newComment.length}/120
    </motion.span>
  </motion.div>
);

export default CommentFormHeader;