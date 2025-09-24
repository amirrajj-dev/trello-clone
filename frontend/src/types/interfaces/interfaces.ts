import { NotificationType, Priority, Role, TaskStatus } from "../enums/enums";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export interface ProjectWithDetails extends Project {
  members: ProjectMember[];
  tasks: Task[];
  _count: {
    members: number;
    tasks: number;
  };
}

export interface ProjectMember {
  id: string;
  role: Role;
  userId: string;
  projectId: string;
  user: {
    name: string;
    avatarUrl?: string | null;
  };
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  assigneeId?: string | null;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  taskId: string;
  userId: string;
  user: {
    name: string;
    avatarUrl?: string | null;
  };
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  userId: string;
  projectId?: string | null;
  taskId?: string | null;
  commentId?: string | null;
  read: boolean;
  createdAt: string;
}