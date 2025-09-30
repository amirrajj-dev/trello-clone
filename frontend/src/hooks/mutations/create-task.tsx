import { useModal } from "@/stores/modal.store";
import { TaskStatus, Priority } from "@/types/enums/enums";
import { taskApi } from "@/utils/api";
import api from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiResponse } from "@/types/api/api.response";
import { Project, ProjectWithDetails, Task } from "@/types/interfaces/interfaces";
import { CreateTaskDto } from "@/utils/dtos";

const getProgress = (status : TaskStatus)=>{
  if (status === TaskStatus.IN_PROGRESS) return 50
  if (status === TaskStatus.DONE) return 100
  return 0
}

export const useCreateTask = (projectId: string) => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { projectId: string; task: CreateTaskDto }) =>
      taskApi.createTask(api, data.projectId, data.task),
    onMutate: async ({ projectId, task }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["user-projects"] });
      await queryClient.cancelQueries({ queryKey: ["project", projectId] });
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });

      // Snapshot previous states
      const previousProjects = queryClient.getQueryData<ApiResponse<Project[]>>(["user-projects"]);
      const previousProject = queryClient.getQueryData<{ data: ProjectWithDetails }>(["project", projectId]);
      const previousTasks = queryClient.getQueryData<ApiResponse<Task[]>>(["tasks", projectId]);

      // temporary task object
      const users = queryClient.getQueryData<{ id: string; name: string; email: string; avatarUrl: string | null }[]>(["users"]);
      const assignee = task.assigneeId ? users?.find((u) => u.id === task.assigneeId) : null;
      const tempTask: Task = {
        id: `temp-${Date.now()}`, // Temporary ID
        title: task.title,
        description: task.description || null,
        status: task.status || TaskStatus.TODO,
        priority: task.priority || Priority.MEDIUM,
        dueDate: task.dueDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        projectId,
        progress: getProgress(task.status as TaskStatus),
        assigneeId: task.assigneeId || null,
        assignee: assignee
          ? { name: assignee.name, email: assignee.email, avatarUrl: assignee.avatarUrl || "" }
          : undefined,
        project: { name: previousProject?.data.name || "Unknown", members: previousProject?.data.members || [] },
        Notification : [],
        _count: { comments: 0 },
      };

      // Optimistically update tasks cache
      queryClient.setQueryData<ApiResponse<Task[]>>(["tasks", projectId], (oldTasks) => {
        if (!oldTasks || !oldTasks.data) {
          return {
            success: true,
            message: "Tasks fetched successfully",
            timestamp: new Date().toISOString(),
            data: [tempTask],
          };
        }
        return {
          ...oldTasks,
          data: [...oldTasks.data, tempTask],
        };
      });

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
                  tasks: [...project.tasks, { progress: 0 }],
                  _count: { ...project._count, tasks: (project._count?.tasks || 0) + 1 },
                }
              : project
          ),
        } as ApiResponse<Project[]>
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
            tasks: [...oldProject.data.tasks, tempTask],
            _count: { ...oldProject.data._count, tasks: (oldProject.data._count?.tasks || 0) + 1 },
          },
        };
      });

      // Return context for rollback
      return { previousProjects, previousProject, previousTasks };
    },
    onSuccess: (response: ApiResponse<Task>, { projectId }) => {
      toast.success(`Task created Succesfully`);

      // Update tasks cache
      queryClient.setQueryData<ApiResponse<Task[]>>(["tasks", projectId], (oldTasks) => {
        if (!oldTasks || !oldTasks.data) {
          return {
            success: true,
            message: "Tasks fetched successfully",
            timestamp: new Date().toISOString(),
            data: [response.data],
          };
        }
        return {
          ...oldTasks,
          data: oldTasks.data.map((t) => (t.id === `temp-${Date.now()}` ? response.data : t)),
        };
      });
      // Update user-projects cache
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
                  tasks: [...project.tasks.filter((t) => t.id !== `temp-${Date.now()}`), { progress: response.data.progress }],
                  _count: { ...project._count, tasks: (project._count?.tasks || 0) + 1 },
                }
              : project
          ),
        } as ApiResponse<Project[]>
      });

      // Update single project cache
      queryClient.setQueryData<{ data: ProjectWithDetails }>(["project", projectId], (oldProject) => {
        if (!oldProject || !oldProject.data) {
          return {
            data: {
              id: projectId,
              name: response.data.project.name,
              description: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              ownerId: "",
              owner: { name: "Unknown" },
              members: [],
              tasks: [response.data],
              _count: { members: 0, tasks: 1 },
            } as ProjectWithDetails,
          };
        }
        return {
          ...oldProject,
          data: {
            ...oldProject.data,
            tasks: [...oldProject.data.tasks.filter((t) => t.id !== `temp-${Date.now()}`), response.data],
            _count: { ...oldProject.data._count, tasks: (oldProject.data._count?.tasks || 0) + 1 },
          },
        };
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["user-projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] }); // If task creation generates notifications
      closeModal();
    },
    onError: (err, { projectId }, context) => {
      // Revert caches
      queryClient.setQueryData(["user-projects"], context?.previousProjects);
      queryClient.setQueryData(["project", projectId], context?.previousProject);
      queryClient.setQueryData(["tasks", projectId], context?.previousTasks);

      toast.error(err.message || "Failed to create task");
    },
  });
};