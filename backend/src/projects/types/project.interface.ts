export interface Project {
  name: string;
  id: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}
