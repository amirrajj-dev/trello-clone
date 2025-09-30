import { useModal } from "@/stores/modal.store";
import { projectApi } from "@/utils/api";
import api from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiResponse } from "@/types/api/api.response";
import { Project, ProjectWithDetails, Task } from "@/types/interfaces/interfaces";

export const useDeleteProject = () => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { projectId: string }) =>
      projectApi.deleteProject(api, data.projectId),
    onMutate: async ({ projectId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["user-projects"] });
      await queryClient.cancelQueries({ queryKey: ["project", projectId] });
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });

      // Snapshot previous states
      const previousProjects = queryClient.getQueryData<ApiResponse<Project[]>>(["user-projects"]);
      const previousProject = queryClient.getQueryData<{ data: ProjectWithDetails }>(["project", projectId]);
      const previousTasks = queryClient.getQueryData<ApiResponse<Task[]>>(["tasks", projectId]);

      // Optimistically update user-projects cache
      queryClient.setQueryData<ApiResponse<Project[]>>(["user-projects"], (oldProjects) => {
        if (!oldProjects || !oldProjects.data) {
          return oldProjects;
        }
        return {
          ...oldProjects,
          data: oldProjects.data.filter((project) => project.id !== projectId),
        };
      });

      // Clear single project cache
      queryClient.removeQueries({ queryKey: ["project", projectId] });

      // Return context for rollback
      return { previousProjects, previousProject, previousTasks };
    },
    onSuccess: (response: ApiResponse<void>, { projectId }) => {
      console.log(projectId);
      toast.success(`Project deleted succesfully`);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["user-projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      closeModal();
    },
    onError: (err, { projectId }, context) => {
      // Revert caches
      queryClient.setQueryData(["user-projects"], context?.previousProjects);
      queryClient.setQueryData(["project", projectId], context?.previousProject);
      queryClient.setQueryData(["tasks", projectId], context?.previousTasks);
      toast.error(err.message || `Failed to delete project`);
    },
  });
};