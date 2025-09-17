export interface AuthReturnType {
  access_token: string; // JWT token
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
}
