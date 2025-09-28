import { useModal } from "@/stores/modal.store";
import { commentApi, projectApi, taskApi } from "@/utils/api";
import api from "@/utils/axios";
import { CreateCommentDto } from "@/utils/dtos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useTransferOwnerShip = (projectId: string) => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { projectId: string; newOwnerId : string }) =>
      projectApi.transferOwnership(api , data.projectId , data.newOwnerId),
    onSuccess: () => {
      toast.success("OwnerShip Transfered Succesfully");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({queryKey : ['user']})
      queryClient.invalidateQueries({queryKey : ["tasks", projectId]})
      queryClient.invalidateQueries({queryKey : ['user-projects']})
      closeModal();
    },
    onError: (err) => toast.error(err.message || "Failed to transfer ownership"),
  });
};
