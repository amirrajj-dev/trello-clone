import { useModal } from "@/stores/modal.store";
import { projectApi } from "@/utils/api";
import api from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateProject = ()=>{
    const {closeModal} = useModal()
    const queryClient = useQueryClient()
    return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      projectApi.createProject(api , data),
    onSuccess: () => {
      toast.success("Project created!");
      queryClient.invalidateQueries({queryKey : ['user-projects']})
      closeModal()
    },
    onError: (err) => toast.error(err.message || "Failed to create project"),
  });
}