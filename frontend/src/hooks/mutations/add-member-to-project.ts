import { useModal } from "@/stores/modal.store";
import { Role } from "@/types/enums/enums";
import { projectApi } from "@/utils/api";
import api from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiResponse } from "@/types/api/api.response";
import { MembershipResponse, Project } from "@/types/interfaces/interfaces";

export const useAddMemberToProject = (projectId: string) => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: string; role?: Role; projectId: string }) =>
      projectApi.addMember(api, data.projectId, {
        userId: data.userId,
        role: data.role,
      }),
    onMutate: async ({ userId, role, projectId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["user-projects"] });
      await queryClient.cancelQueries({ queryKey: ["project", projectId] });

      // Snapshot previous states
      const previousProject = queryClient.getQueryData<{ data: Project }>(["project", projectId]);
      const previousProjects = queryClient.getQueryData<ApiResponse<Project[]>>(["user-projects"]);

      // Get user details from ["users"] cache
      const users = queryClient.getQueryData<{ id: string; name: string; email: string; avatarUrl: string | null }[]>(["users"]);
      const user = users?.find((u) => u.id === userId) || {
        id: userId,
        name: "Unknown",
        email: "",
        avatarUrl: null,
      };

      // temporary member object
      const newMember = {
        userId,
        role: role || "MEMBER",
        user: {
          id: userId,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
      };

      // Optimistically update user-projects cache
      queryClient.setQueryData<ApiResponse<Project[]>>(["user-projects"], (oldProjects) => {
        if (!oldProjects || !oldProjects.data) {
          return {
            success: true,
            message: "Projects fetched successfully",
            timestamp: new Date().toISOString(),
            data: previousProject
              ? [{ ...previousProject.data, members: [...(previousProject.data.members || []), newMember] }]
              : [],
          } as ApiResponse<Project[]> ;
        }
        return {
          ...oldProjects,
          data: oldProjects.data.map((project) => {
            if (project.id !== projectId) return project;
           
            // Add new member
            return {
              ...project,
              members: [...project.members, newMember],
              _count: { ...project._count, members: (project._count?.members || 0) + 1 },
            };
          }),
        } as ApiResponse<Project[]>; ;
      });

      // Optimistically update single project cache
      queryClient.setQueryData<{ data: Project }>(["project", projectId], (oldProject) => {
        if (!oldProject || !oldProject.data) {
          return {
            data: {
              id: projectId,
              name: "Unknown Project",
              description: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              ownerId: "",
              owner: { name: "Unknown" },
              members: [newMember],
              tasks: [],
              _count: { members: 1, tasks: 0 },
            } as Project,
          } as { data: Project };
        }
        // Add new member
        return {
          ...oldProject,
          data: {
            ...oldProject.data,
            members: [...oldProject.data.members, newMember],
            _count: { ...oldProject.data._count, members: (oldProject.data._count?.members || 0) + 1 },
          },
        } as { data: Project };
      });

      // Return context for rollback
      return { previousProject, previousProjects };
    },
    onSuccess: (membership: { data: MembershipResponse }) => {
      const newMemberName = membership.data.user.name;
      const newMember = {
        userId: membership.data.user.id,
        role: membership.data.role,
        user: membership.data.user,
      };

      // Check if user is already a member
      const previousProject = queryClient.getQueryData<{ data: Project }>(["project", projectId]);

      toast.success(`Added ${newMemberName} to the project!`);

      // Update user-projects cache
      queryClient.setQueryData<ApiResponse<Project[]>>(["user-projects"], (oldProjects) => {
        if (!oldProjects || !oldProjects.data) {
          return {
            success: true,
            message: "Projects fetched successfully",
            timestamp: new Date().toISOString(),
            data: previousProject
              ? [{ ...previousProject.data, members: [...(previousProject.data.members || []), newMember] }]
              : [],
          };
        }
        return {
          ...oldProjects,
          data: oldProjects.data.map((p) => {
            if (p.id !== membership.data.project.id) return p;
            const existingMember = p.members.find((m) => m.userId === membership.data.user.id);
            if (existingMember) {
              // Update existing member's role
              return {
                ...p,
                members: p.members.map((m) =>
                  m.userId === membership.data.user.id ? newMember : m
                ),
              } as Project;
            }
            // Add new member
            return {
              ...p,
              members: [...p.members, newMember],
              _count: { ...p._count, members: (p._count?.members || 0) + 1 },
            };
          }),
        };
      });

      // Update single project cache
      queryClient.setQueryData<{ data: Project }>(["project", projectId], (oldProject) => {
        if (!oldProject || !oldProject.data) {
          return {
            data: {
              id: projectId,
              name: membership.data.project.name,
              description: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              ownerId: "",
              owner: { name: "Unknown" },
              members: [newMember],
              tasks: [],
              _count: { members: 1, tasks: 0 },
            } as Project,
          };
        }
        const existingMember = oldProject.data.members.find((m) => m.userId === membership.data.user.id);
        if (existingMember) {
          // Update existing member's role
          return {
            ...oldProject,
            data: {
              ...oldProject.data,
              members: oldProject.data.members.map((m) =>
                m.userId === membership.data.user.id ? newMember : m
              ),
            },
          };
        }
        // Add new member
        return {
          ...oldProject,
          data: {
            ...oldProject.data,
            members: [...oldProject.data.members, newMember],
            _count: { ...oldProject.data._count, members: (oldProject.data._count?.members || 0) + 1 },
          },
        };
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["user-projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      closeModal();
    },
    onError: (err, {}, context) => {
      toast.error(err.message || `Failed to add user to the project`);
    },
  });
};