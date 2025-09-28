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
  Comment,
  Project,
  ProjectMember,
  ProjectWithDetails,
  Task,
  User,
} from "@/types/interfaces/interfaces";

// Auth API
const authApi = {
  signup: (api: AxiosInstance, user: SignUpUserDto) =>
    api
      .post<ApiResponse<{ access_token: string; user: User }>>(
        "/auth/signup",
        user
      )
      .then((res) => res.data),
  login: (api: AxiosInstance, user: LoginUserDto) =>
    api
      .post<ApiResponse<{ access_token: string; user: User }>>(
        "/auth/login",
        user
      )
      .then((res) => res.data),
};

// User API
const userApi = {
  getMe: (api: AxiosInstance) =>
    api.get<ApiResponse<User>>("/users/me").then((res) => res.data),
  getUser: (api: AxiosInstance, id: string) =>
    api.get<ApiResponse<User>>(`/users/${id}`).then((res) => res.data),
  getUsers: (api: AxiosInstance) =>
    api.get<ApiResponse<User[]>>("/users").then((res) => res.data),
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
    return api
      .put<ApiResponse<User>>(`/users/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },
  deleteUser: (api: AxiosInstance, id: string) =>
    api.delete<ApiResponse<void>>(`/users/${id}`).then((res) => res.data),
  getTasks: (api: AxiosInstance) =>
    api.get(`/users/me/tasks`).then((res) => res.data),
};

// Project API
const projectApi = {
  getProjects: (api: AxiosInstance) =>
    api.get<ApiResponse<Project[]>>("/projects").then((res) => res.data),
  getProject: (api: AxiosInstance, id: string) =>
    api
      .get<ApiResponse<ProjectWithDetails>>(`/projects/${id}`)
      .then((res) => res.data),
  createProject: (api: AxiosInstance, project: CreateProjectDto) =>
    api
      .post<ApiResponse<Project>>("/projects", project)
      .then((res) => res.data),
  updateProject: (api: AxiosInstance, id: string, project: UpdateProjectDto) =>
    api
      .put<ApiResponse<ProjectWithDetails>>(`/projects/${id}`, project)
      .then((res) => res.data),
  deleteProject: (api: AxiosInstance, id: string) =>
    api.delete<ApiResponse<void>>(`/projects/${id}`).then((res) => res.data),
  addMember: (api: AxiosInstance, id: string, member: AddMemberToProjectDto) =>
    api
      .post<ApiResponse<ProjectMember>>(`/projects/${id}/members`, member)
      .then((res) => res.data),
  removeMember: (api: AxiosInstance, id: string, memberId: string) =>
    api
      .delete<
        ApiResponse<{ projectId: string; userId: string; message: string }>
      >(`/projects/${id}/members/${memberId}`)
      .then((res) => res.data),
  changeMemberRole: (
    api: AxiosInstance,
    id: string,
    memberId: string,
    role: ChangeMemberRoleDto
  ) =>
    api
      .put<ApiResponse<void>>(`/projects/${id}/members/${memberId}`, role)
      .then((res) => res.data),
  transferOwnership: (api: AxiosInstance, id: string, newOwnerId: string) =>
    api
      .put<ApiResponse<ProjectWithDetails>>(
        `/projects/${id}/transfer-ownership/${newOwnerId}`
      )
      .then((res) => res.data),
};

// Task API
const taskApi = {
  createTask: (api: AxiosInstance, projectId: string, task: CreateTaskDto) =>
    api
      .post<ApiResponse<Task>>(`/projects/${projectId}/tasks`, task)
      .then((res) => res.data),
  getTasks: (api: AxiosInstance, projectId: string) =>
    api
      .get<ApiResponse<Task[]>>(`/projects/${projectId}/tasks`)
      .then((res) => res.data),
  updateTask: (
    api: AxiosInstance,
    projectId: string,
    taskId: string,
    task: UpdateTaskDto
  ) =>
    api
      .put<ApiResponse<Task>>(`/tasks/${projectId}/${taskId}`, task)
      .then((res) => res.data),
  deleteTask: (api: AxiosInstance, projectId: string, taskId: string) =>
    api
      .delete<ApiResponse<{ id: string; projectId: string }>>(
        `/tasks/${projectId}/${taskId}`
      )
      .then((res) => res.data),
};

// Comment API
const commentApi = {
  createComment: (
    api: AxiosInstance,
    projectId: string,
    taskId: string,
    comment: CreateCommentDto
  ) =>
    api
      .post<ApiResponse<Comment>>(
        `/tasks/${projectId}/${taskId}/comments`,
        comment
      )
      .then((res) => res.data),
  getComments: (api: AxiosInstance, projectId: string, taskId: string) =>
    api
      .get<ApiResponse<Comment[]>>(`/tasks/${projectId}/${taskId}/comments`)
      .then((res) => res.data),
  updateComment: (
    api: AxiosInstance,
    projectId: string,
    commentId: string,
    comment: UpdateCommentDto
  ) =>
    api
      .put<ApiResponse<Comment>>(`/comments/${projectId}/${commentId}`, comment)
      .then((res) => res.data),
  deleteComment: (api: AxiosInstance, projectId: string, commentId: string) =>
    api
      .delete<ApiResponse<{ id: string; taskId: string }>>(
        `/comments/${projectId}/${commentId}`
      )
      .then((res) => res.data),
};

// Notification API
const notificationApi = {
  getNotifications: (api: AxiosInstance) =>
    api
      .get<ApiResponse<Notification[]>>("/notifications")
      .then((res) => res.data),
  deleteReadNotifications: (api: AxiosInstance) =>
    api
      .delete<ApiResponse<{ message: string }>>("/notifications/delete-read")
      .then((res) => res.data),
};

export { authApi, userApi, projectApi, taskApi, commentApi, notificationApi };
