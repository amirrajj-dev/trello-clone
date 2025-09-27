import { useModal } from "@/stores/modal.store";
import { projectApi } from "@/utils/api";
import api from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRemoveMemberFromProject = () => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { projectId: string; memberId: string }) =>
      projectApi.removeMember(api, data.projectId, data.memberId),
    onSuccess: () => {
      toast.success("User removed from project!");
      queryClient.invalidateQueries({ queryKey: ["user-projects"] });
      queryClient.invalidateQueries({ queryKey: ["user-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      closeModal();
    },
    onError: (err) => toast.error(err.message || "Failed to delete user from project"),
  });
};
