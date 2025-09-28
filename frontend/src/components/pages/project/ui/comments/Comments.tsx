import { useGetTaskComments } from "@/hooks/queries/task-comments";
import { useAddComment } from "@/hooks/mutations/add-comment";
import { toast } from "sonner";
import { useGetMe } from "@/hooks/queries/user";
import { useState } from "react";
import CommentsHeader from "./ui/CommentsHeader";
import CommentList from "./ui/CommentList";
import AddCommentForm from "./ui/AddCommentForm";
import CommentsCount from "./ui/CommentsCount";

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
  const taskComments = taskCommentsData?.data;
  const addComment = useAddComment(projectId, taskId);

  const handleSubmitComment = (e: React.FormEvent) => {
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
    const index = userId.charCodeAt(0) % colors.length;
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
      />
      <AddCommentForm
        newComment={newComment}
        setNewComment={setNewComment}
        handleSubmitComment={handleSubmitComment}
        isPending={addComment.isPending}
      />
      <CommentsCount taskComments={taskComments} />
    </div>
  );
};

export default Comments;