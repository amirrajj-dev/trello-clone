import { motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";
import UpdateModeHeader from "./ui/UpdateModeHeader";
import CommentFormHeader from "./ui/CommentFormHeader";
import CommentTextArea from "./ui/CommentTextArea";
import CommentFormActions from "./ui/CommentFormActions";

interface AddCommentFormProps {
  newComment: string;
  setNewComment: (value: string) => void;
  handleAddComment: (e: React.FormEvent) => void;
  isPendingAddComment: boolean;
  isPendingUpdateComment: boolean;
  isInUpdateMode: boolean;
  setIsInUpdateMode: Dispatch<SetStateAction<boolean>>;
  handleUpdateComment: (e: React.FormEvent, commentId: string) => void;
  commentToUpdateId: string | null;
}

const AddCommentForm = ({
  newComment,
  setNewComment,
  handleAddComment,
  isPendingAddComment,
  isInUpdateMode,
  setIsInUpdateMode,
  handleUpdateComment,
  isPendingUpdateComment,
  commentToUpdateId,
}: AddCommentFormProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="space-y-4"
  >
    <UpdateModeHeader
      isInUpdateMode={isInUpdateMode}
      isPendingUpdateComment={isPendingUpdateComment}
      setIsInUpdateMode={setIsInUpdateMode}
      setNewComment={setNewComment}
    />
    <motion.form
      onSubmit={(e) => {
        if (isInUpdateMode) {
          handleUpdateComment(e, commentToUpdateId as string);
        } else {
          handleAddComment(e);
        }
      }}
      className="space-y-4"
    >
      <CommentFormHeader
        isInUpdateMode={isInUpdateMode}
        newComment={newComment}
      />
      <CommentTextArea
        newComment={newComment}
        setNewComment={setNewComment}
        isInUpdateMode={isInUpdateMode}
      />
      <CommentFormActions
        isInUpdateMode={isInUpdateMode}
        isPendingAddComment={isPendingAddComment}
        isPendingUpdateComment={isPendingUpdateComment}
        newComment={newComment}
        setIsInUpdateMode={setIsInUpdateMode}
        setNewComment={setNewComment}
        commentToUpdateId={commentToUpdateId}
        handleAddComment={handleAddComment}
        handleUpdateComment={handleUpdateComment}
      />
    </motion.form>
  </motion.div>
);

export default AddCommentForm;