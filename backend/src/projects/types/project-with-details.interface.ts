export interface ProjectWithDetails {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  members: Array<{
    userId: string;
    user: {
      name: string;
      avatarUrl?: string | null;
    };
    role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  }>;
  tasks: Array<{
    id: string;
    title: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    assigneeId?: string | null;
  }>;
  _count: {
    members: number;
    tasks: number;
  };
}
