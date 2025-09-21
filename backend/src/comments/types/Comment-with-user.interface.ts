import { Comment } from './comment.interface';

export interface CommentWithUser extends Comment {
  user: {
    name: string;
    avatarUrl?: string | null;
  };
}
