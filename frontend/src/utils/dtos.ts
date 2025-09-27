import { Role } from "@/types/enums/enums";

interface SignUpUserDto {
  email: string;
  password: string;
  name: string;
}

interface LoginUserDto {
  email: string;
  password: string;
}

interface UpdateUserDto {
  name?: string;
  email?: string;
  avatarUrl?: string;
  imagePublicId?: string;
}

interface CreateProjectDto {
  name: string;
  description?: string;
}

interface UpdateProjectDto {
  name?: string;
  description?: string;
}

interface AddMemberToProjectDto {
  userId: string;
  role?: Role;
}

interface ChangeMemberRoleDto {
  role: Role;
}

interface CreateTaskDto {
  title: string;
  description?: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
  assigneeId?: string;
}

interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
  assigneeId?: string;
}

interface CreateCommentDto {
  content: string;
}

interface UpdateCommentDto {
  content?: string;
}

export type {
  SignUpUserDto,
  LoginUserDto,
  UpdateUserDto,
  CreateProjectDto,
  UpdateProjectDto,
  AddMemberToProjectDto,
  ChangeMemberRoleDto,
  CreateTaskDto,
  UpdateTaskDto,
  CreateCommentDto,
  UpdateCommentDto,
};
