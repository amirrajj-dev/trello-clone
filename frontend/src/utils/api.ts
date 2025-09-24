import { AxiosInstance } from "axios";
import {
  AddMemberToProjectDto,
  ChangeMemberRoleDto,
  CreateCommentDto,
  CreateProjectDto,
  CreateTaskDto,
  LoginUserDto,
  SignUpUserDto,
  UpdateCommentDto,
  UpdateProjectDto,
  UpdateTaskDto,
  UpdateUserDto,
} from "./dtos";
import { ApiResponse } from "@/types/api/api.response";
import {
  Project,
  ProjectMember,
  ProjectWithDetails,
  Task,
  User,
} from "@/types/interfaces/interfaces";

// Auth API
const authApi = {
  signup: (api: AxiosInstance, user: SignUpUserDto) =>
    api.post<{ access_token: string; user: User }>(
      "/auth/signup",
      user
    ),
  login: (api: AxiosInstance, user: LoginUserDto) =>
    api.post<{ access_token: string; user: User }>(
      "/auth/login",
      user
    ),
};

// User API
const userApi = {
  getMe: (api: AxiosInstance) => api.get<ApiResponse<User>>("/users/me"),
  getUser: (api: AxiosInstance, id: string) =>
    api.get<ApiResponse<User>>(`/users/${id}`),
  updateUser: (
    api: AxiosInstance,
    id: string,
    data: UpdateUserDto,
    file?: File
  ) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value);
    });
    if (file) formData.append("file", file);
    return api.put<ApiResponse<User>>(`/users/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  deleteUser: (api: AxiosInstance, id: string) =>
    api.delete<ApiResponse<void>>(`/users/${id}`),
};

// Project API
const projectApi = {
  getProjects: (api: AxiosInstance) =>
    api.get<ApiResponse<Project[]>>(`/projects`),
  getProject: (api: AxiosInstance, id: string) =>
    api.get<ApiResponse<ProjectWithDetails>>(`/projects/${id}`),
  createProject: (api: AxiosInstance, project: CreateProjectDto) =>
    api.post<ApiResponse<Project>>("/projects", project),
  updateProject: (api: AxiosInstance, id: string, project: UpdateProjectDto) =>
    api.put<ApiResponse<ProjectWithDetails>>(`/projects/${id}`, project),
  deleteProject: (api: AxiosInstance, id: string) =>
    api.delete<ApiResponse<void>>(`/projects/${id}`),
  addMember: (api: AxiosInstance, id: string, member: AddMemberToProjectDto) =>
    api.post<ApiResponse<ProjectMember>>(`/projects/${id}/members`, member),
  removeMember: (api: AxiosInstance, id: string, memberId: string) =>
    api.delete<
      ApiResponse<{ projectId: string; userId: string; message: string }>
    >(`/projects/${id}/members/${memberId}`),
  changeMemberRole: (
    api: AxiosInstance,
    id: string,
    memberId: string,
    role: ChangeMemberRoleDto
  ) => api.put<ApiResponse<void>>(`/projects/${id}/members/${memberId}`, role),
  transferOwnership: (api: AxiosInstance, id: string, newOwnerId: string) =>
    api.put<ApiResponse<ProjectWithDetails>>(
      `/projects/${id}/transfer-ownership/${newOwnerId}`
    ),
};

// Task API
const taskApi = {
  createTask: (api: AxiosInstance, projectId: string, task: CreateTaskDto) =>
    api.post<ApiResponse<Task>>(`/projects/${projectId}/tasks`, task),
  getTasks: (api: AxiosInstance, projectId: string) =>
    api.get<ApiResponse<Task[]>>(`/projects/${projectId}/tasks`),
  updateTask: (
    api: AxiosInstance,
    projectId: string,
    taskId: string,
    task: UpdateTaskDto
  ) => api.put<ApiResponse<Task>>(`/tasks/${projectId}/${taskId}`, task),
  deleteTask: (api: AxiosInstance, projectId: string, taskId: string) =>
    api.delete<ApiResponse<{ id: string; projectId: string }>>(
      `/tasks/${projectId}/${taskId}`
    ),
};

// Comment API
const commentApi = {
  createComment: (
    api: AxiosInstance,
    projectId: string,
    taskId: string,
    comment: CreateCommentDto
  ) =>
    api.post<ApiResponse<Comment>>(
      `/tasks/${projectId}/${taskId}/comments`,
      comment
    ),
  getComments: (api: AxiosInstance, projectId: string, taskId: string) =>
    api.get<ApiResponse<Comment[]>>(`/tasks/${projectId}/${taskId}/comments`),
  updateComment: (
    api: AxiosInstance,
    projectId: string,
    commentId: string,
    comment: UpdateCommentDto
  ) =>
    api.put<ApiResponse<Comment>>(
      `/comments/${projectId}/${commentId}`,
      comment
    ),
  deleteComment: (api: AxiosInstance, projectId: string, commentId: string) =>
    api.delete<ApiResponse<{ id: string; taskId: string }>>(
      `/comments/${projectId}/${commentId}`
    ),
};

// Notification API
const notificationApi = {
  getNotifications: (api: AxiosInstance) =>
    api.get<ApiResponse<Notification[]>>("/notifications"),
  deleteReadNotifications: (api: AxiosInstance) =>
    api.delete<ApiResponse<{ message: string }>>("/notifications/delete-read"),
};

export { authApi, userApi, projectApi, taskApi, commentApi, notificationApi };
