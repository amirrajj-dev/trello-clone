import { User } from '../users/types/user.interface';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
