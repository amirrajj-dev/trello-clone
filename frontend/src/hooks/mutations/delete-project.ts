import { useModal } from "@/stores/modal.store";
import { projectApi } from "@/utils/api";
import api from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteProject = () => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectId: string) => projectApi.deleteProject(api, projectId),
    onSuccess: () => {
      toast.success("Project deleted!");
      queryClient.invalidateQueries({ queryKey: ["user-projects"] });
      queryClient.invalidateQueries({ queryKey: ["user-tasks"] });
      closeModal();
    },
    onError: (err) => toast.error(err.message || "Failed to delete project"),
  });
};
