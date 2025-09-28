import { useModal } from "@/stores/modal.store";
import { commentApi, taskApi } from "@/utils/api";
import api from "@/utils/axios";
import { CreateCommentDto } from "@/utils/dtos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteTask = (projectId: string) => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { projectId: string; taskId: string }) =>
      taskApi.deleteTask(api, data.projectId, data.taskId),
    onSuccess: () => {
      toast.success("Task deleted Succesfully");
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      closeModal();
    },
    onError: (err) => toast.error(err.message || "Failed to delete task"),
  });
};
