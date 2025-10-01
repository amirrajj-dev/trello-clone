import { useModal } from "@/stores/modal.store";
import { Role } from "@/types/enums/enums";
import { projectApi } from "@/utils/api";
import api from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiResponse } from "@/types/api/api.response";
import { Project, ProjectWithDetails } from "@/types/interfaces/interfaces";

export const useChangeRole = (projectId: string) => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: string; role: Role; projectId: string }) =>
      projectApi.changeMemberRole(api, data.projectId, data.userId, {
        role: data.role,
      }),
    onMutate: async ({ userId, role, projectId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["user-projects"] });
      await queryClient.cancelQueries({ queryKey: ["project", projectId] });

      // Snapshot previous states
      const previousProjects = queryClient.getQueryData<ApiResponse<Project[]>>(["user-projects"]);
      const previousProject = queryClient.getQueryData<{ data: ProjectWithDetails }>(["project", projectId]);

      // Prevent changing OWNER role
      const currentMember = previousProject?.data.members.find((m) => m.userId === userId);
      if (currentMember?.role === Role.OWNER) {
        throw new Error("Cannot change the role of the project owner");
      }

      // Optimistically update user-projects cache
      queryClient.setQueryData<ApiResponse<Project[]>>(["user-projects"], (oldProjects) => {
        if (!oldProjects || !oldProjects.data) {
          return oldProjects;
        }
        return {
          ...oldProjects,
          data: oldProjects.data.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  members: project.members.map((m) =>
                    m.userId === userId ? { ...m, role } : m
                  ),
                }
              : project
          ),
        };
      });

      // Optimistically update single project cache
      queryClient.setQueryData<{ data: ProjectWithDetails }>(["project", projectId], (oldProject) => {
        if (!oldProject || !oldProject.data) {
          return oldProject;
        }
        return {
          ...oldProject,
          data: {
            ...oldProject.data,
            members: oldProject.data.members.map((m) =>
              m.userId === userId ? { ...m, role } : m
            ),
          },
        };
      });

      // Return context for rollback
      return { previousProjects, previousProject };
    },
    onSuccess: () => {
      toast.success(`User role updated`);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["user-projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      closeModal();
    },
    onError: (err, { userId, projectId }, context) => {
      // Revert caches
      queryClient.setQueryData(["user-projects"], context?.previousProjects);
      queryClient.setQueryData(["project", projectId], context?.previousProject);

      const userName =
        queryClient
          .getQueryData<{ data: { id: string; name: string }[] }>(["users"])
          ?.data.find((u) => u.id === userId)?.name || "User";
      toast.error(err.message || `Failed to update role for ${userName}`);
    },
  });
};