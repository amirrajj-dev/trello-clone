import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader, X, RefreshCw } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const CommentFormActions = ({
  isInUpdateMode,
  isPendingAddComment,
  isPendingUpdateComment,
  newComment,
  setIsInUpdateMode,
  setNewComment,
  commentToUpdateId,
  handleAddComment,
  handleUpdateComment,
}: {
  isInUpdateMode: boolean;
  isPendingAddComment: boolean;
  isPendingUpdateComment: boolean;
  newComment: string;
  setIsInUpdateMode: Dispatch<SetStateAction<boolean>>;
  setNewComment: (value: string) => void;
  commentToUpdateId: string | null;
  handleAddComment: (e: React.FormEvent) => void;
  handleUpdateComment: (e: React.FormEvent, commentId: string) => void;
}) => (
  <div className="flex justify-between items-center">
    <AnimatePresence>
      {isInUpdateMode && (
        <motion.button
          type="button"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setIsInUpdateMode(false);
            setNewComment("");
          }}
          className="btn btn-ghost rounded-xl border border-base-300 hover:bg-base-300 transition-all duration-200 flex items-center gap-2"
          disabled={isPendingUpdateComment}
        >
          <X size={16} />
          Cancel Edit
        </motion.button>
      )}
    </AnimatePresence>
    <motion.button
      type="submit"
      className={`btn rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2 ml-auto ${
        isInUpdateMode
          ? "btn-warning bg-gradient-to-r from-warning to-amber-500 hover:from-warning/90 hover:to-amber-500/90 text-warning-content"
          : "btn-primary bg-gradient-to-r from-primary to-info hover:from-primary/90 hover:to-info/90 text-primary-content"
      }`}
      disabled={
        !newComment.trim() ||
        newComment.length < 4 ||
        isPendingAddComment ||
        isPendingUpdateComment
      }
      onClick={(e) => {
        if (isInUpdateMode) {
          handleUpdateComment(e, commentToUpdateId as string);
        } else {
          handleAddComment(e);
        }
      }}
    >
      <AnimatePresence mode="wait">
        {isInUpdateMode ? (
          isPendingUpdateComment ? (
            <motion.div
              key="loading-update"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Loader size={16} className="animate-spin" />
              Updating...
            </motion.div>
          ) : (
            <motion.div
              key="update"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Update Comment
            </motion.div>
          )
        ) : isPendingAddComment ? (
          <motion.div
            key="loading-add"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Loader size={16} className="animate-spin" />
            Posting...
          </motion.div>
        ) : (
          <motion.div
            key="add"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Send size={16} />
            Post Comment
          </motion.div>
        )}
      </AnimatePresence>
      {newComment.trim() && newComment.length >= 4 && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"
          initial={{ x: "-100%" }}
          whileHover={{ x: "200%" }}
          transition={{ duration: 0.8 }}
        />
      )}
    </motion.button>
  </div>
);

export default CommentFormActions;