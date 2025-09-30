import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const CommentTextArea = ({
  newComment,
  setNewComment,
  isInUpdateMode,
}: {
  newComment: string;
  setNewComment: (value: string) => void;
  isInUpdateMode: boolean;
}) => (
  <motion.div
    className="relative"
    whileHover={{ scale: 1.01 }}
    whileFocus={{ scale: 1.01 }}
    animate={{
      borderColor: isInUpdateMode ? "hsl(var(--wa))" : "hsl(var(--b3))",
    }}
  >
    <textarea
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      placeholder={isInUpdateMode ? "Update your comment..." : "Type your comment here..."}
      className="textarea textarea-bordered w-full bg-base-200 border-base-300 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 resize-none min-h-[120px] p-4 pr-20"
      style={{
        borderColor: isInUpdateMode ? "hsl(var(--wa))" : undefined,
      }}
      maxLength={120}
    />
    <AnimatePresence>
      {newComment.length > 0 && newComment.length < 4 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-3 left-3 flex items-center gap-1 text-error text-xs bg-error/10 px-2 py-1 rounded"
        >
          <Sparkles size={10} />
          Min 4 characters
        </motion.div>
      )}
    </AnimatePresence>
    <AnimatePresence>
      {isInUpdateMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0, rotate: 180 }}
          className="absolute top-3 right-3"
        >
          <div className="bg-warning/20 text-warning text-xs px-2 py-1 rounded-full border border-warning/30 font-medium">
            EDIT MODE
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default CommentTextArea;