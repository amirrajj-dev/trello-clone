import { useModal } from "@/stores/modal.store";
import { commentApi, taskApi } from "@/utils/api";
import api from "@/utils/axios";
import { CreateCommentDto, UpdateTaskDto } from "@/utils/dtos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateTask = (projectId: string) => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      projectId: string;
      taskId: string;
      task: UpdateTaskDto;
    }) => taskApi.updateTask(api, data.projectId, data.taskId, data.task),
    onSuccess: () => {
      toast.success("Task Updated Succesfully");
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["user-projects"] });
      closeModal();
    },
    onError: (err) => toast.error(err.message || "Failed to update task"),
  });
};
