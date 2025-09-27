import { useModal } from "@/stores/modal.store";
import { projectApi } from "@/utils/api";
import api from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateProject = () => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name: string;
      description?: string;
      projectId: string;
    }) =>
      projectApi.updateProject(api, data.projectId, {
        description: data.description,
        name: data.name,
      }),
    onSuccess: () => {
      toast.success("Project updated!");
      queryClient.invalidateQueries({ queryKey: ["user-projects"] });
      closeModal();
    },
    onError: (err) => toast.error(err.message || "Failed to update project"),
  });
};
