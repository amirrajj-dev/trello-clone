import { useModal } from "@/stores/modal.store";
import { projectApi } from "@/utils/api";
import api from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiResponse } from "@/types/api/api.response";
import { Project, ProjectWithDetails, Task } from "@/types/interfaces/interfaces";

interface RemoveMemberResponse {
  projectId: string;
  userId: string;
  message: string;
}

export const useRemoveMemberFromProject = (projectId: string) => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { memberId: string; projectId: string }) =>
      projectApi.removeMember(api, data.projectId, data.memberId),
    onMutate: async ({ memberId, projectId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["user-projects"] });
      await queryClient.cancelQueries({ queryKey: ["project", projectId] });
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });

      // Snapshot previous states
      const previousProjects = queryClient.getQueryData<ApiResponse<Project[]>>(["user-projects"]);
      const previousProject = queryClient.getQueryData<{ data: ProjectWithDetails }>(["project", projectId]);
      const previousTasks = queryClient.getQueryData<ApiResponse<Task[]>>(["tasks", projectId]);

      // Prevent removing the project owner
      if (previousProject?.data.ownerId === memberId) {
        throw new Error("Cannot remove the project owner");
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
                  members: project.members.filter((m) => m.userId !== memberId),
                  _count: {
                    ...project._count,
                    members: Math.max(0, (project._count?.members || 0) - 1),
                  },
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
            members: oldProject.data.members.filter((m) => m.userId !== memberId),
            _count: {
              ...oldProject.data._count,
              members: Math.max(0, (oldProject.data._count?.members || 0) - 1),
            },
          },
        };
      });

      // Return context for rollback
      return { previousProjects, previousProject, previousTasks };
    },
    onSuccess: () => {
      toast.success(`Removed user from the project`);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["user-projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] }); // If member was assigned to tasks
      closeModal();
    },
    onError: (err, { memberId, projectId }, context) => {
      // Revert caches
      queryClient.setQueryData(["user-projects"], context?.previousProjects);
      queryClient.setQueryData(["project", projectId], context?.previousProject);
      queryClient.setQueryData(["tasks", projectId], context?.previousTasks);
      toast.error(err.message || `Failed to remove user from the project`);
    },
  });
};