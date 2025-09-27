export interface ProjectWithCounts {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  _count: {
    tasks: number;
    members: number;
  };
  members: Array<{
    user: {
      name: string;
    };
  }>;
  owner: {
    name: string;
  };
}
