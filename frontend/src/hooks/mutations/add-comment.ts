import { commentApi } from "@/utils/api";
import api from "@/utils/axios";
import { CreateCommentDto } from "@/utils/dtos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiResponse } from "@/types/api/api.response";
import { Comment, Task, User } from "@/types/interfaces/interfaces";

export const useAddComment = (projectId: string, taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      projectId: string;
      taskId: string;
      comment: CreateCommentDto;
    }) =>
      commentApi.createComment(api, data.projectId, data.taskId, data.comment),
    onMutate: async ({ projectId, taskId, comment }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["comments", taskId] });
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });

      // Snapshot previous states
      const previousComments = queryClient.getQueryData<ApiResponse<Comment[]>>(["comments", taskId]);
      const previousTasks = queryClient.getQueryData<ApiResponse<Task[]>>(["tasks", projectId]);
      const currentUser = queryClient.getQueryData(['user' , 'me']) as User
      // temporary comment object
      const tempComment: Comment = {
        id: `temp-${Date.now()}`, // Temporary ID
        content: comment.content,
        userId: currentUser?.id || 'unknown' ,
        user: {
          name: currentUser?.name || 'unknown',
          avatarUrl: currentUser.avatarUrl || '',
        },
        taskId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Optimistically add the comment to the comments cache
      queryClient.setQueryData<ApiResponse<Comment[]>>(["comments", taskId], (oldComments) => {
        if (!oldComments || !oldComments.data) {
          return {
            success: true,
            message: "Comments fetched successfully",
            timestamp: new Date().toISOString(),
            data: [tempComment],
          };
        }
        return {
          ...oldComments,
          data: [...oldComments.data, tempComment],
        };
      });

      // Optimistically increment _count.comments in the tasks cache
      queryClient.setQueryData<ApiResponse<Task[]>>(["tasks", projectId], (oldTasks) => {
        if (!oldTasks || !oldTasks.data) {
          return oldTasks;
        }
        return {
          ...oldTasks,
          data: oldTasks.data.map((task) =>
            task.id === taskId
              ? { ...task, _count: { ...task._count, comments: task._count.comments + 1 } }
              : task
          ),
        };
      });

      // Return context for rollback
      return { previousComments, previousTasks };
    },
    onSuccess: (newComment) => {
      toast.success("Comment Created Successfully");
      // Update comments cache with the real comment
      queryClient.setQueryData<ApiResponse<Comment[]>>(["comments", taskId], (oldComments) => {
        if (!oldComments || !oldComments.data) {
          return {
            success: true,
            message: "Comments fetched successfully",
            timestamp: new Date().toISOString(),
            data: [newComment.data],
          };
        }
        return {
          ...oldComments,
          data: oldComments.data.map((c) =>
            c.id === `temp-${newComment.data.createdAt}` ? newComment.data : c
          ),
        };
      });
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
    onError: (err, _variables, context) => {
      // Revert both caches on error
      queryClient.setQueryData(["comments", taskId], context?.previousComments);
      queryClient.setQueryData(["tasks", projectId], context?.previousTasks);
      toast.error(err.message || "Failed to create comment");
    },
  });
};