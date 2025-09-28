import { commentApi } from "@/utils/api";
import api from "@/utils/axios";
import { CreateCommentDto } from "@/utils/dtos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddComment = (projectId : string , taskId : string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      projectId: string;
      taskId: string;
      comment: CreateCommentDto;
    }) =>
      commentApi.createComment(api, data.projectId, data.taskId, data.comment),
    onSuccess: () => {
      toast.success("Comment Created Succesfully");
      queryClient.invalidateQueries({ queryKey: ["tasks" , projectId] });
      queryClient.invalidateQueries({ queryKey: ["project" , projectId] });
      queryClient.invalidateQueries({queryKey : ["comments", taskId]})
    },
    onError: (err) => toast.error(err.message || "Failed to create comment"),
  });
};
