import { Role } from 'src/common/enums/role.enum';

export interface ProjectMemberResponse {
  id: string;
  project: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  role: Role | undefined;
}
