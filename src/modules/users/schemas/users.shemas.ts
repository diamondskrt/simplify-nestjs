import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().min(1, 'email is required'),
});

const UpdateUserSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  avatar_url: z.string().optional(),
});

export { UpdateUserSchema, UserSchema };
