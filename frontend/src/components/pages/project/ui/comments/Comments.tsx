import { useGetTaskComments } from "@/hooks/queries/task-comments";
import { useAddComment } from "@/hooks/mutations/add-comment";
import { toast } from "sonner";
import { useGetMe } from "@/hooks/queries/user";
import { useState } from "react";
import CommentsHeader from "./ui/CommentsHeader";
import CommentList from "./ui/CommentList";
import AddCommentForm from "./ui/addCommentForm/AddCommentForm";
import CommentsCount from "./ui/CommentsCount";
import { useUpdateComment } from "@/hooks/mutations/update-comment";

const Comments = ({
  projectId,
  taskId,
}: {
  taskId: string;
  projectId: string;
}) => {
  const { data: taskCommentsData, isLoading } = useGetTaskComments(
    taskId,
    projectId
  );
  const { data: currentUser } = useGetMe();
  const [newComment, setNewComment] = useState("");
  const [isInUpdateMode, setIsInUpdateMode] = useState(false);
  const taskComments = taskCommentsData?.data;
  const addComment = useAddComment(projectId, taskId);
  const updateComment = useUpdateComment(projectId, taskId);
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.error("Comment content is required");
      return;
    }

    if (newComment.length < 4) {
      toast.error("Comment must be at least 4 characters long");
      return;
    }

    if (newComment.length > 120) {
      toast.error("Comment must be less than 120 characters");
      return;
    }

    addComment.mutate({
      projectId,
      taskId,
      comment: { content: newComment.trim() },
    });
    setNewComment("");
  };
  const [commentToUpdateId, setCommentToUpdateId] = useState<string | null>(
    null
  );

  const handleUpdateComment = (e: React.FormEvent, commentId: string) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.error("Comment content is required");
      return;
    }

    if (newComment.length < 4) {
      toast.error("Comment must be at least 4 characters long");
      return;
    }

    if (newComment.length > 120) {
      toast.error("Comment must be less than 120 characters");
      return;
    }

    updateComment.mutate({
      projectId,
      commentId,
      comment: { content: newComment.trim() },
    });
    setNewComment("");
    setTimeout(() => {
      setIsInUpdateMode(false)
    }, 5000);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (userId: string) => {
    const colors = [
      "bg-primary/20 text-primary",
      "bg-secondary/20 text-secondary",
      "bg-accent/20 text-accent",
      "bg-info/20 text-info",
      "bg-success/20 text-success",
      "bg-warning/20 text-warning",
    ];
    const index = userId.charCodeAt(24) % colors.length;
    return colors[index];
  };

  return (
    <div className="space-y-6">
      <CommentsHeader />
      <CommentList
        isLoading={isLoading}
        taskComments={taskComments}
        currentUser={currentUser}
        getUserInitials={getUserInitials}
        getRandomColor={getRandomColor}
        projectId={projectId}
        taskId={taskId}
        setNewComment={setNewComment}
        setIsInUpdateMode={setIsInUpdateMode}
        setCommentToUpdateId={setCommentToUpdateId}
      />
      <AddCommentForm
        newComment={newComment}
        setNewComment={setNewComment}
        handleAddComment={handleAddComment}
        isPendingAddComment={addComment.isPending}
        handleUpdateComment={handleUpdateComment}
        isPendingUpdateComment={updateComment.isPending}
        isInUpdateMode={isInUpdateMode}
        setIsInUpdateMode={setIsInUpdateMode}
        commentToUpdateId={commentToUpdateId}
      />
      <CommentsCount taskComments={taskComments} />
    </div>
  );
};

export default Comments;
