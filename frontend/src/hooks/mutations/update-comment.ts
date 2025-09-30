import { commentApi } from "@/utils/api";
import api from "@/utils/axios";
import { UpdateCommentDto } from "@/utils/dtos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiResponse } from "@/types/api/api.response";
import { Comment } from "@/types/interfaces/interfaces";

export const useUpdateComment = (projectId: string, taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      projectId: string;
      commentId: string;
      comment: UpdateCommentDto;
    }) =>
      commentApi.updateComment(api, data.projectId, data.commentId, data.comment),
    onMutate: async ({ projectId, commentId, comment }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["comments", taskId] });

      // Snapshot previous comments state
      const previousComments = queryClient.getQueryData<ApiResponse<Comment[]>>(["comments", taskId]);

      // Optimistically update the comment in the comments cache
      queryClient.setQueryData<ApiResponse<Comment[]>>(["comments", taskId], (oldComments) => {
        if (!oldComments || !oldComments.data) {
          return oldComments;
        }
        return {
          ...oldComments,
          data: oldComments.data.map((c) =>
            c.id === commentId
              ? { ...c, content: comment.content, updatedAt: new Date().toISOString() }
              : c
          ),
        } as ApiResponse<Comment[]>
      });

      // Return context for rollback
      return { previousComments };
    },
    onSuccess: (updatedComment) => {
      toast.success("Comment Updated Successfully");
      // Update cache with the real comment
      queryClient.setQueryData<ApiResponse<Comment[]>>(["comments", taskId], (oldComments) => {
        if (!oldComments || !oldComments.data) {
          return {
            success: true,
            message: "Comments fetched successfully",
            timestamp: new Date().toISOString(),
            data: [updatedComment.data],
          };
        }
        return {
          ...oldComments,
          data: oldComments.data.map((c) =>
            c.id === updatedComment.data.id ? updatedComment.data : c
          ),
        };
      });
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
    onError: (err, _variables, context) => {
      // Revert comments cache on error
      queryClient.setQueryData(["comments", taskId], context?.previousComments);
      toast.error(err.message || "Failed to update comment");
    },
  });
};