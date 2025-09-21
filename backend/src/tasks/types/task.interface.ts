export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: Date | null;
  projectId: string;
  assigneeId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
