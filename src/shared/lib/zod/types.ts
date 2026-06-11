import z from 'zod';
import { PaginationSchema } from './schemas';

type PaginationSchemaDto = z.infer<typeof PaginationSchema>;

type UUID = z.ZodUUID;

export type { PaginationSchemaDto, UUID };
