import { useModal } from "@/stores/modal.store";
import { taskApi } from "@/utils/api";
import api from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Task, Project, ProjectWithDetails, User } from "@/types/interfaces/interfaces";
import { ApiResponse } from "@/types/api/api.response";

interface DeleteTaskResponse {
  id: string;
  projectId: string;
}

export const useDeleteTask = (projectId: string) => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  const updateCaches = (
    taskId: string,
    oldTasks?: ApiResponse<Task[]>,
    oldProject?: { data: ProjectWithDetails },
    oldProjects?: ApiResponse<Project[]>
  ) => {
    // Update tasks cache
    queryClient.setQueryData<ApiResponse<Task[]>>(["tasks", projectId], (old) => {
      if (!old?.data) return old;
      return {
        ...old,
        data: old.data.filter((t) => t.id !== taskId),
      };
    });

    // Update single project cache
    queryClient.setQueryData<{ data: ProjectWithDetails }>(["project", projectId], (old) => {
      if (!old?.data) return old;
      return {
        ...old,
        data: {
          ...old.data,
          tasks: old.data.tasks.filter((t) => t.id !== taskId),
          _count: { ...old.data._count, tasks: Math.max(0, (old.data._count?.tasks || 0) - 1) },
        },
      };
    });

    // Update user-projects cache
    queryClient.setQueryData<ApiResponse<Project[]>>(["user-projects"], (old) => {
      if (!old?.data) return old;
      return {
        ...old,
        data: old.data.map((p) =>
          p.id === projectId
            ? {
                ...p,
                tasks: p.tasks.filter((t) => t.id !== taskId),
                _count: { ...p._count, tasks: Math.max(0, (p._count?.tasks || 0) - 1) },
              }
            : p
        ),
      };
    });

    return { previousTasks: oldTasks, previousProject: oldProject, previousProjects: oldProjects };
  };

  return useMutation({
    mutationFn: (data: { projectId: string; taskId: string }) =>
      taskApi.deleteTask(api, data.projectId, data.taskId),
    onMutate: async ({ projectId, taskId }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });
      await queryClient.cancelQueries({ queryKey: ["project", projectId] });
      await queryClient.cancelQueries({ queryKey: ["user-projects"] });

      const previousTasks = queryClient.getQueryData<ApiResponse<Task[]>>(["tasks", projectId]);
      const previousProject = queryClient.getQueryData<{ data: ProjectWithDetails }>(["project", projectId]);
      const previousProjects = queryClient.getQueryData<ApiResponse<Project[]>>(["user-projects"]);
      const currentUser = queryClient.getQueryData<{ data: User }>(["me"])?.data;

      return updateCaches(taskId, previousTasks, previousProject, previousProjects);
    },
    onSuccess: (response: ApiResponse<DeleteTaskResponse>, { projectId, taskId }) => {
      toast.success(`Task delete succesfully`);

      updateCaches(taskId);

      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["user-projects"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      closeModal();
    },
    onError: (err, { projectId, taskId }, context) => {
      queryClient.setQueryData(["tasks", projectId], context?.previousTasks);
      queryClient.setQueryData(["project", projectId], context?.previousProject);
      queryClient.setQueryData(["user-projects"], context?.previousProjects);
      toast.error(err.message || `Failed to delete task`);
    },
  });
};