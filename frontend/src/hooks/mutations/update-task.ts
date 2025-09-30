import { useModal } from "@/stores/modal.store";
import { TaskStatus} from "@/types/enums/enums";
import { taskApi } from "@/utils/api";
import api from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Task,
  Project,
  ProjectWithDetails,
  User,
} from "@/types/interfaces/interfaces";
import { UpdateTaskDto } from "@/utils/dtos";
import { ApiResponse } from "@/types/api/api.response";

// my helper :)
const getProgress = (status: TaskStatus) => {
  if (status === TaskStatus.IN_PROGRESS) return 50;
  if (status === TaskStatus.DONE) return 100;
  return 0;
};

export const useUpdateTask = (projectId: string) => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  const updateCaches = (
    taskId: string,
    taskData: Partial<Task>,
    oldTasks?: ApiResponse<Task[]>,
    oldProject?: { data: ProjectWithDetails },
    oldProjects?: ApiResponse<Project[]>
  ) => {
    // Update tasks cache
    queryClient.setQueryData<ApiResponse<Task[]>>(
      ["tasks", projectId],
      (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((t) =>
            t.id === taskId ? { ...t, ...taskData , progress : getProgress(taskData.status as TaskStatus) } : t
          ),
        };
      }
    );

    // Update single project cache
    queryClient.setQueryData<{ data: ProjectWithDetails }>(
      ["project", projectId],
      (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            tasks: old.data.tasks.map((t) =>
              t.id === taskId
                ? {
                    ...t,
                    ...taskData,
                    progress: getProgress(taskData.status as TaskStatus),
                  }
                : t
            ),
          },
        };
      }
    );

    // Update user-projects cache (progress only)
    queryClient.setQueryData<ApiResponse<Project[]>>(
      ["user-projects"],
      (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  tasks: p.tasks.map((t) =>
                    t.id === taskId
                      ? { progress: taskData.progress ?? t.progress }
                      : t
                  ),
                }
              : p
          ),
        } as ApiResponse<Project[]>
      }
    );

    return {
      previousTasks: oldTasks,
      previousProject: oldProject,
      previousProjects: oldProjects,
    };
  };

  return useMutation({
    mutationFn: (data: {
      projectId: string;
      taskId: string;
      task: UpdateTaskDto;
    }) => taskApi.updateTask(api, data.projectId, data.taskId, data.task),
    onMutate: async ({ projectId, taskId, task }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });
      await queryClient.cancelQueries({ queryKey: ["project", projectId] });
      await queryClient.cancelQueries({ queryKey: ["user-projects"] });

      const previousTasks = queryClient.getQueryData<ApiResponse<Task[]>>([
        "tasks",
        projectId,
      ]);
      const previousProject = queryClient.getQueryData<{
        data: ProjectWithDetails;
      }>(["project", projectId]);
      const previousProjects = queryClient.getQueryData<ApiResponse<Project[]>>(
        ["user-projects"]
      );
      const users = queryClient.getQueryData<{ data: User[] }>(["users"]);

      // Prepare optimistic task data
      const assignee = task.assigneeId
        ? users?.data.find((u) => u.id === task.assigneeId)
        : null;
      const updatedTask: Partial<Task> = {
        ...task,
        assigneeId: task.assigneeId || null,
        assignee: assignee
          ? {
              name: assignee.name,
              email: assignee.email,
              avatarUrl: assignee.avatarUrl || "",
            }
          : undefined,
        updatedAt: new Date().toISOString(),
      };

      return updateCaches(
        taskId,
        updatedTask,
        previousTasks,
        previousProject,
        previousProjects
      );
    },
    onSuccess: (response: ApiResponse<Task>, { projectId, taskId }) => {
      toast.success(`Task Updated`);

      updateCaches(taskId, response.data);

      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["user-projects"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      closeModal();
    },
    onError: (err, { projectId }, context) => {
      queryClient.setQueryData(["tasks", projectId], context?.previousTasks);
      queryClient.setQueryData(
        ["project", projectId],
        context?.previousProject
      );
      queryClient.setQueryData(["user-projects"], context?.previousProjects);
      toast.error(err.message || `Failed to update task`);
    },
  });
};
