export interface User {
  name: string;
  id: string;
  email: string;
  password: string;
  avatarUrl?: string | null;
  imagePublicId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
