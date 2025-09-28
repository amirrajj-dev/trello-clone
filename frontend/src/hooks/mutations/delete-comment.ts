import { commentApi } from "@/utils/api";
import api from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteComment = (projectId : string , taskId : string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      projectId: string;
      commentId: string;
    }) =>
      commentApi.deleteComment(api , data.projectId , data.commentId),
    onSuccess: () => {
      toast.success("Comment Delete Succesfully");
      queryClient.invalidateQueries({ queryKey: ["tasks" , projectId] });
      queryClient.invalidateQueries({ queryKey: ["project" , projectId] });
      queryClient.invalidateQueries({queryKey : ["comments", taskId]})
    },
    onError: (err) => toast.error(err.message || "Failed to Delete comment"),
  });
};
