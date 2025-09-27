import { useModal } from "@/stores/modal.store";
import { Task } from "@/types/interfaces/interfaces";
import { projectApi, taskApi } from "@/utils/api";
import api from "@/utils/axios";
import { CreateTaskDto } from "@/utils/dtos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateTask = () => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { projectId: string; task: CreateTaskDto }) =>
      taskApi.createTask(api, data.projectId, data.task),
    onSuccess: () => {
      toast.success("Task created Succesfully");
      queryClient.invalidateQueries({ queryKey: ["user-projects"] });
      queryClient.invalidateQueries({ queryKey: ["user-tasks"] });
      closeModal();
    },
    onError: (err) => toast.error(err.message || "Failed to create task"),
  });
};
