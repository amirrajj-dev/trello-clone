import { z } from 'zod';

export const schema = z.object({
  email: z.string().min(1, 'Email is required').email(),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

export type SignInType = z.infer<typeof schema>;