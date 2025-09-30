import { commentApi } from "@/utils/api";
import api from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiResponse } from "@/types/api/api.response";
import { Comment, Task } from "@/types/interfaces/interfaces";

export const useDeleteComment = (projectId: string, taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { projectId: string; commentId: string }) =>
      commentApi.deleteComment(api, data.projectId, data.commentId),
    onMutate: async ({ projectId, commentId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["comments", taskId] });
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });

      // Snapshot previous states
      const previousComments = queryClient.getQueryData<ApiResponse<Comment[]>>(["comments", taskId]);
      const previousTasks = queryClient.getQueryData<ApiResponse<Task[]>>(["tasks", projectId]);

      // Optimistically remove the comment from the comments cache
      queryClient.setQueryData<ApiResponse<Comment[]>>(["comments", taskId], (oldComments) => {
        if (!oldComments || !oldComments.data) {
          return oldComments;
        }
        return {
          ...oldComments,
          data: oldComments.data.filter((comment) => comment.id !== commentId),
        };
      });

      // Optimistically decrement _count.comments in the tasks cache
      queryClient.setQueryData<ApiResponse<Task[]>>(["tasks", projectId], (oldTasks) => {
        if (!oldTasks || !oldTasks.data) {
          return oldTasks;
        }
        return {
          ...oldTasks,
          data: oldTasks.data.map((task) =>
            task.id === taskId
              ? { ...task, _count: { ...task._count, comments: Math.max(0, task._count.comments - 1) } }
              : task
          ),
        };
      });

      // Return context for rollback
      return { previousComments, previousTasks };
    },
    onSuccess: () => {
      toast.success("Comment Deleted Successfully");
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
    onError: (err, _variables, context) => {
      // Revert both caches on error
      queryClient.setQueryData(["comments", taskId], context?.previousComments);
      queryClient.setQueryData(["tasks", projectId], context?.previousTasks);
      toast.error(err.message || "Failed to delete comment");
    },
  });
};