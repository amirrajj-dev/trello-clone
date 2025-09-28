import { motion, AnimatePresence } from "framer-motion";
import { User, Send, Loader } from "lucide-react";

const AddCommentForm = ({
  newComment,
  setNewComment,
  handleSubmitComment,
  isPending,
}: {
  newComment: string;
  setNewComment: (value: string) => void;
  handleSubmitComment: (e: React.FormEvent) => void;
  isPending: boolean;
}) => (
  <motion.form
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    onSubmit={handleSubmitComment}
    className="space-y-3"
  >
    <div className="flex items-center gap-2 text-sm font-medium text-base-content">
      <User size={16} className="text-primary" />
      Add a comment
    </div>
    <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Type your comment here..."
        className="textarea textarea-bordered w-full bg-base-200 border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none min-h-[100px] p-4"
        maxLength={120}
      />
    </motion.div>
    <div className="flex justify-between items-center">
      <span className="text-xs text-base-content/40">
        {newComment.length}/120 characters
      </span>
      <motion.button
        type="submit"
        whileHover={{ scale: newComment.trim() ? 1.02 : 1 }}
        whileTap={{ scale: newComment.trim() ? 0.98 : 1 }}
        className="btn btn-primary rounded-xl bg-gradient-to-r from-primary to-info hover:from-primary/90 hover:to-info/90 text-primary-content shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2"
        disabled={!newComment.trim() || isPending}
      >
        <AnimatePresence mode="wait">
          {isPending ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Loader size={16} className="animate-spin" />
              Posting...
            </motion.div>
          ) : (
            <>
              <Send size={16} />
              Post Comment
            </>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  </motion.form>
);

export default AddCommentForm;