import { useModal } from "@/stores/modal.store";
import { projectApi } from "@/utils/api";
import api from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiResponse } from "@/types/api/api.response";
import { Project, User } from "@/types/interfaces/interfaces";
import { Role } from "@/types/enums/enums";

export const useCreateProject = () => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      projectApi.createProject(api, data),
    onMutate: async ({ name, description }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["user-projects"] });

      // Snapshot previous projects state
      const previousProjects = queryClient.getQueryData<ApiResponse<Project[]>>(
        ["user-projects"]
      );

      const currentUser = queryClient.getQueryData(["user", "me"]) as User;
      // temporary project object
      const tempProject: Project = {
        id: `temp-${Date.now()}`, // Temporary ID
        name,
        description: description || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        members: [
          {
            user: {
              name: currentUser?.name,
              avatarUrl: currentUser?.avatarUrl as string,
              id: currentUser?.id,
            },
            role: Role.OWNER,
            userId : currentUser.id
          },
        ],
        ownerId: currentUser?.id,
        owner: { name: currentUser?.name },
        tasks: [],
        _count: { tasks: 0, members: 0 }, // New project has no tasks
      };

      // Optimistically add the project to the cache
      queryClient.setQueryData<ApiResponse<Project[]>>(
        ["user-projects"],
        (oldProjects) => {
          if (!oldProjects || !oldProjects.data) {
            return {
              success: true,
              message: "Projects fetched successfully",
              timestamp: new Date().toISOString(),
              data: [tempProject],
            };
          }
          return {
            ...oldProjects,
            data: [...oldProjects.data, tempProject],
          };
        }
      );

      // Return context for rollback
      return { previousProjects };
    },
    onSuccess: (newProject) => {
      toast.success(`Project "${newProject.data.name}" Created Successfully`);
      // Update cache with the real project
      queryClient.setQueryData<ApiResponse<Project[]>>(
        ["user-projects"],
        (oldProjects) => {
          if (!oldProjects || !oldProjects.data) {
            return {
              success: true,
              message: "Projects fetched successfully",
              timestamp: new Date().toISOString(),
              data: [newProject.data],
            };
          }
          return {
            ...oldProjects,
            data: oldProjects.data.map((p) =>
              p.id === `temp-${newProject.data.createdAt}` ? newProject.data : p
            ),
          };
        }
      );
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["user-projects"] });
      closeModal();
    },
    onError: (err, _variables, context) => {
      // Revert cache on error
      queryClient.setQueryData(["user-projects"], context?.previousProjects);
      toast.error(err.message || "Failed to create project");
    },
  });
};
