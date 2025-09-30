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
  _count: {
    members: number;
    tasks: number;
  };
  members: {
    user: { name: string; avatarUrl: string | null; id: string };
    role: Role;
    userId : string;
  }[];
  tasks: { progress: number , id : string }[];
  owner: {
    name: string;
  };
}

export interface ProjectWithDetails extends Project {
  members: ProjectMember[];
  tasks: (Task & { progress: number })[];
  projectId? : string;
  newOwnerId? : string
}

export interface ProjectMember {
  id: string;
  role: Role;
  userId: string;
  projectId: string;
  project : {id : string; name : string}
  user: { name: string; avatarUrl: string | null; id: string; email: string };
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
  progress: number;
  assignee? : {
    name : string;
    email : string;
    avatarUrl : string
  }
  project: {
    name: string;
    members: {
      role: Role;
      userId: string;
      user : {
        name : string
      }
    }[];
  };
  _count : {comments :number}
  Notification : Notification[]
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

export interface MembershipResponse {
  id: string;
  project: { id: string; name: string };
  user: { id: string; name: string; email: string; avatarUrl: string | null };
  role: Role;
}