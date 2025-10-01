import { useModal } from "@/stores/modal.store";
import { userApi } from "@/utils/api";
import api from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { User, Project, ProjectWithDetails, Task } from "@/types/interfaces/interfaces";
import { UpdateUserDto } from "@/utils/dtos";
import { ApiResponse } from "@/types/api/api.response";

export const useUpdateUser = () => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  const updateCaches = (
    userId: string,
    userData: Partial<User>,
    oldMe?: { data: User },
    oldUsers?: { data: User[] },
    oldProjects?: ApiResponse<Project[]>,
    oldProjectMap?: Map<string, { data: ProjectWithDetails }>,
    oldTasksMap?: Map<string, ApiResponse<Task[]>>
  ) => {
    // Update me cache
    queryClient.setQueryData<{ data: User }>(["me"], (old) => {
      if (!old?.data) return old;
      return { ...old, data: { ...old.data, ...userData } };
    });

    // Update users cache
    queryClient.setQueryData<{ data: User[] }>(["users"], (old) => {
      if (!old?.data) return old;
      return {
        ...old,
        data: old.data.map((u) => (u.id === userId ? { ...u, ...userData } : u)),
      };
    });

    // Update user-projects cache
    queryClient.setQueryData<ApiResponse<Project[]>>(["user-projects"], (old) => {
      if (!old?.data) return old;
      return {
        ...old,
        data: old.data.map((p) => ({
          ...p,
          owner: p.ownerId === userId ? { name: userData.name || p.owner.name } : p.owner,
          members: p.members.map((m) =>
            m.userId === userId ? { ...m, user: { ...m.user, ...userData } } : m
          ),
        })),
      };
    });

    // Update project caches
    oldProjectMap?.forEach((oldProject, projectId) => {
      queryClient.setQueryData<{ data: ProjectWithDetails }>(["project", projectId], (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            owner: old.data.ownerId === userId ? { name: userData.name || old.data.owner.name } : old.data.owner,
            members: old.data.members.map((m) =>
              m.userId === userId ? { ...m, user: { ...m.user, ...userData } } : m
            ),
          },
        };
      });
    });

    // Update tasks caches
    oldTasksMap?.forEach((oldTasks, projectId) => {
      queryClient.setQueryData<ApiResponse<Task[]>>(["tasks", projectId], (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((t) =>
            t.assigneeId === userId ? { ...t, assignee: { ...t.assignee, ...userData } } : t
          ),
        } as ApiResponse<Task[]>
      });
    });

    return { previousMe: oldMe, previousUsers: oldUsers, previousProjects: oldProjects, previousProjectMap: oldProjectMap, previousTasksMap: oldTasksMap };
  };

  return useMutation({
    mutationFn: ({ id, data, file }: { id: string; data: UpdateUserDto; file?: File }) =>
      userApi.updateUser(api, id, data, file),
    onMutate: async ({ id, data, file }) => {
      await queryClient.cancelQueries({ queryKey: ["user"] });
      await queryClient.cancelQueries({ queryKey: ["users"] });
      await queryClient.cancelQueries({ queryKey: ["user-projects"] });

      const previousMe = queryClient.getQueryData<{ data: User }>(["me"]);
      const previousUsers = queryClient.getQueryData<{ data: User[] }>(["users"]);
      const previousProjects = queryClient.getQueryData<ApiResponse<Project[]>>(["user-projects"]);
      const previousProjectMap = new Map<string, { data: ProjectWithDetails }>();
      const previousTasksMap = new Map<string, ApiResponse<Task[]>>();

      // Cache project and task queries
      previousProjects?.data.forEach((p) => {
        const projectData = queryClient.getQueryData<{ data: ProjectWithDetails }>(["project", p.id]);
        if (projectData) previousProjectMap.set(p.id, projectData);
        const tasksData = queryClient.getQueryData<ApiResponse<Task[]>>(["tasks", p.id]);
        if (tasksData) previousTasksMap.set(p.id, tasksData);
      });

      // Prepare optimistic user data
      const userData: Partial<User> = {
        ...data,
        avatarUrl: file ? URL.createObjectURL(file) : data.avatarUrl || previousMe?.data.avatarUrl,
      };

      return updateCaches(id, userData, previousMe, previousUsers, previousProjects, previousProjectMap, previousTasksMap);
    },
    onSuccess: (response: ApiResponse<User>, { id }) => {
      toast.success(`Profile updated`);

      updateCaches(id, response.data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-projects"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      closeModal();
    },
    onError: (err, { }, context) => {
      queryClient.setQueryData(["users"], context?.previousUsers);
      queryClient.setQueryData(["user-projects"], context?.previousProjects);
      context?.previousProjectMap?.forEach((project, projectId) => {
        queryClient.setQueryData(["project", projectId], project);
      });
      context?.previousTasksMap?.forEach((tasks, projectId) => {
        queryClient.setQueryData(["tasks", projectId], tasks);
      });

      toast.error(err.message || "Failed to update profile");
    },
  });
};