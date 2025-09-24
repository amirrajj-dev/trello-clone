import { passwordReg } from '@/helpers/regex';
import { z } from 'zod';

export const schema = z.object({
  name: z.string().min(1, 'Name is required').min(6).max(30),
  email: z.string().min(1, 'Email is required').email(),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .regex(passwordReg, {
      message:
        'Password should contain at least one lowercase letter, one uppercase letter, one digit, one special character, and a minimum of 8 characters',
    }),
});

export type SignUpType = z.infer<typeof schema>;