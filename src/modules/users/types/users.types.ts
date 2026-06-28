import z from 'zod';

import { UpdateUserSchema, UserSchema } from '../config';

type UpdateUser = z.infer<typeof UpdateUserSchema>;

type User = z.infer<typeof UserSchema>;

export type { UpdateUser, User };
