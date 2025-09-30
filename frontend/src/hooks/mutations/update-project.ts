import { useModal } from "@/stores/modal.store";
import { projectApi } from "@/utils/api";
import api from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiResponse } from "@/types/api/api.response";
import { Project } from "@/types/interfaces/interfaces";

export const useUpdateProject = (projectId : string) => {
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
    onMutate: async ({ projectId, name, description }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["user-projects"] });
      await queryClient.cancelQueries({ queryKey: ["project", projectId] });

      // Snapshot previous states
      const previousProjects = queryClient.getQueryData<ApiResponse<Project[]>>(["user-projects"]);
      const previousProject = queryClient.getQueryData<{ data: Project }>(["project", projectId]);

      // Optimistically update the project in the user-projects cache
      queryClient.setQueryData<ApiResponse<Project[]>>(["user-projects"], (oldProjects) => {
        if (!oldProjects || !oldProjects.data) {
          return oldProjects;
        }
        return {
          ...oldProjects,
          data: oldProjects.data.map((project) =>
            project.id === projectId
              ? { ...project, name, description: description || null, updatedAt: new Date().toISOString() }
              : project
          ),
        };
      });

      // Optimistically update the single project cache (if used)
      queryClient.setQueryData<{ data: Project }>(["project", projectId], (oldProject) => {
        if (!oldProject || !oldProject.data) {
          return oldProject;
        }
        return {
          ...oldProject,
          data: { ...oldProject.data, name, description: description || null, updatedAt: new Date().toISOString() },
        };
      });

      // Return context for rollback
      return { previousProjects, previousProject };
    },
    onSuccess: (updatedProject) => {
      toast.success(`Project "${updatedProject.data.name}" Updated Successfully`);
      // Update caches with the real project
      queryClient.setQueryData<ApiResponse<Project[]>>(["user-projects"], (oldProjects) => {
        if (!oldProjects || !oldProjects.data) {
          return {
            success: true,
            message: "Projects fetched successfully",
            timestamp: new Date().toISOString(),
            data: [updatedProject.data],
          };
        }
        return {
          ...oldProjects,
          data: oldProjects.data.map((p) => (p.id === updatedProject.data.id ? updatedProject.data : p)),
        };
      });
      queryClient.setQueryData<{ data: Project }>(["project", projectId], (oldProject) => {
        if (!oldProject) {
          return { data: updatedProject.data };
        }
        return { ...oldProject, data: updatedProject.data };
      });
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["user-projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      closeModal();
    },
    onError: (err, _variables, context) => {
      // Revert caches on error
      queryClient.setQueryData(["user-projects"], context?.previousProjects);
      queryClient.setQueryData(["project", projectId], context?.previousProject);
      toast.error(err.message || "Failed to update project");
    },
  });
};