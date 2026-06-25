import { z } from 'zod';

const FIRSTNAME_MIN_LENGTH = 1;
const FIRSTNAME_MAX_LENGTH = 15;
const LASTNAME_MIN_LENGTH = 1;
const LASTNAME_MAX_LENGTH = 15;

const firstName = z
  .string()
  .min(FIRSTNAME_MIN_LENGTH, {
    message: `Title must be at least ${FIRSTNAME_MIN_LENGTH} character`,
  })
  .max(FIRSTNAME_MAX_LENGTH, {
    message: `Title must be at most ${FIRSTNAME_MAX_LENGTH} characters`,
  });

const lastName = z
  .string()
  .min(LASTNAME_MIN_LENGTH, {
    message: `Title must be at least ${LASTNAME_MIN_LENGTH} character`,
  })
  .max(LASTNAME_MAX_LENGTH, {
    message: `Title must be at most ${LASTNAME_MAX_LENGTH} characters`,
  });

const UserSchema = z.object({
  id: z.uuid({ message: 'Invalid UUID format' }),
  avatarUrl: z.url().nullable().optional(),
  firstName: firstName,
  lastName: lastName,
});

const UpdateUserSchema = z.object({
  avatarUrl: z.url().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
});

export { UpdateUserSchema, UserSchema };
