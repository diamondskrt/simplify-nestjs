import { z } from 'zod';

const UserSchema = z.object({
  firstName: z.string().min(1, 'email is required'),
});

const UpdateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatarUrl: z.url().optional(),
});

export { UpdateUserSchema, UserSchema };
