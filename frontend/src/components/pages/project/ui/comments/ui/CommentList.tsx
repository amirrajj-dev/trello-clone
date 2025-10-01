import { motion, AnimatePresence } from "framer-motion";
import { Loader, MessageSquare, Clock, Trash, Edit } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useDeleteComment } from "@/hooks/mutations/delete-comment";
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";

interface CommentListProps {
  isLoading: boolean;
  taskComments: any[] | undefined;
  currentUser: any;
  getUserInitials: (name: string) => string;
  getRandomColor: (userId: string) => string;
  projectId: string;
  taskId: string;
  setNewComment: Dispatch<SetStateAction<string>>
  setIsInUpdateMode: Dispatch<SetStateAction<boolean>>
  setCommentToUpdateId: Dispatch<SetStateAction<string | null>>
}

const CommentList = ({
  isLoading,
  taskComments,
  currentUser,
  getUserInitials,
  getRandomColor,
  projectId,
  taskId,
  setNewComment,
  setIsInUpdateMode,
  setCommentToUpdateId
}: CommentListProps) => {
  const deleteComment = useDeleteComment(projectId, taskId);
  const handleDeleteComment = (commentId: string) => {
    deleteComment.mutate({ commentId, projectId });
  };
  const handleGoToUpdateMode = (content : string , id : string) => {
    setNewComment(content)
    setIsInUpdateMode(true)
    setCommentToUpdateId(id)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="space-y-4 max-h-96 overflow-y-auto"
    >
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-8"
          >
            <Loader size={24} className="animate-spin text-primary" />
          </motion.div>
        ) : taskComments && taskComments.length > 0 ? (
          taskComments.map((comment, index: number) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              className="bg-base-200 rounded-xl p-4 border border-base-300 hover:border-base-content/20 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${getRandomColor(
                    comment.userId
                  )} font-semibold text-sm`}
                >
                  {comment?.user?.avatarUrl ? (
                    <Image
                      src={comment.user.avatarUrl}
                      alt={comment.user.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    getUserInitials(comment?.user?.name)
                  )}
                </motion.div>
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col gap-2 mb-1">
                    <div className="flex items-center gap-1">
                      <h4 className="font-semibold text-base-content text-sm">
                        {comment.user.name}
                      </h4>
                      <span className="text-base-content/40 text-xs">•</span>
                      <div className="flex items-center gap-1 text-base-content/60 text-xs">
                        <Clock size={12} />
                        {format(
                          parseISO(comment.createdAt),
                          "MMM d, yyyy • HH:mm"
                        )}
                      </div>
                    </div>
                    <p className="text-base-content/80 text-sm leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                  {comment.userId === currentUser?.id && (
                    <div className="flex items-center justify-center gap-1">
                      <button
                        disabled={deleteComment.isPending}
                        onClick={() => handleDeleteComment(comment.id)}
                        className="btn btn-circle btn-soft btn-error"
                      >
                        {deleteComment.isPending ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <Loader size={16} className="animate-spin" />
                          </motion.div>
                        ) : (
                          <Trash size={16} />
                        )}
                      </button>
                      <button onClick={()=>handleGoToUpdateMode(comment.content , comment.id)} className="btn btn-circle btn-soft btn-info">
                        <Edit size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <MessageSquare
              size={48}
              className="mx-auto text-base-content/20 mb-4"
            />
            <h4 className="text-base-content/60 font-medium mb-2">
              No comments yet
            </h4>
            <p className="text-base-content/40 text-sm">
              Be the first to start the discussion
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CommentList;
