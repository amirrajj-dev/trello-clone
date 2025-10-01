import { useModal } from "@/stores/modal.store";
import { userApi } from "@/utils/api";
import api from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { User, Project, ProjectWithDetails, Task } from "@/types/interfaces/interfaces";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/api/api.response";
import { deleteCookie } from "@/helpers/delete-cookie";

export const useDeleteUser = () => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const router = useRouter();

  const updateCaches = (
    userId: string,
    oldUsers?: { data: User[] },
    oldProjects?: ApiResponse<Project[]>,
    oldProjectMap?: Map<string, { data: ProjectWithDetails }>,
    oldTasksMap?: Map<string, ApiResponse<Task[]>>
  ) => {
    // Remove from users cache
    queryClient.setQueryData<{ data: User[] }>(["users"], (old) => {
      if (!old?.data) return old;
      return {
        ...old,
        data: old.data.filter((u) => u.id !== userId),
      };
    });

    // Update user-projects cache
    queryClient.setQueryData<ApiResponse<Project[]>>(["user-projects"], (old) => {
      if (!old?.data) return old;
      return {
        ...old,
        data: old.data.map((p) => ({
          ...p,
          members: p.members.filter((m) => m.userId !== userId),
          ownerId: p.ownerId === userId ? "" : p.ownerId,
          owner: p.ownerId === userId ? { name: "Unknown" } : p.owner,
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
            members: old.data.members.filter((m) => m.userId !== userId),
            ownerId: old.data.ownerId === userId ? "" : old.data.ownerId,
            owner: old.data.ownerId === userId ? { name: "Unknown" } : old.data.owner,
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
          data: old.data.map((t) => (t.assigneeId === userId ? { ...t, assigneeId: null, assignee: null } : t)),
        } as ApiResponse<Task[]>
      }) 
    });

    return { previousUsers: oldUsers, previousProjects: oldProjects, previousProjectMap: oldProjectMap, previousTasksMap: oldTasksMap };
  };

  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(api, id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["me"] });
      await queryClient.cancelQueries({ queryKey: ["users"] });
      await queryClient.cancelQueries({ queryKey: ["user-projects"] });

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

      queryClient.setQueryData(["me"], null);
      return updateCaches(id, previousUsers, previousProjects, previousProjectMap, previousTasksMap);
    },
    onSuccess: async () => {
      toast.success(`Account deleted goodbye :(`);

      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-projects"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      await deleteCookie()
      router.push("/signin");
      closeModal();
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["users"], context?.previousUsers);
      queryClient.setQueryData(["user-projects"], context?.previousProjects);
      context?.previousProjectMap?.forEach((project, projectId) => {
        queryClient.setQueryData(["project", projectId], project);
      });
      context?.previousTasksMap?.forEach((tasks, projectId) => {
        queryClient.setQueryData(["tasks", projectId], tasks);
      });

      toast.error(err.message || "Failed to delete account");
    },
  });
};