import { useModal } from "@/stores/modal.store";
import { Role } from "@/types/enums/enums";
import { projectApi } from "@/utils/api";
import api from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddMemberToProject = () => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { userId: string; role?: Role; projectId: string }) =>
      projectApi.addMember(api, data.projectId, {
        userId: data.userId,
        role: data.role,
      }),
    onSuccess: () => {
      toast.success("user added to the project!");
      queryClient.invalidateQueries({ queryKey: ["user-projects"] });
      closeModal();
    },
    onError: (err) => toast.error(err.message || "Failed to add user to the project"),
  });
};
