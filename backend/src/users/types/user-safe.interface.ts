export interface SafeUser {
  id: string;
  avatarUrl?: string | null;
  name: string;
  email: string;
  imagePublicId?: string | null;
  projects: Array<{
    project: { name: string };
    role: string;
  }>;
}
// used for responses expicit type
