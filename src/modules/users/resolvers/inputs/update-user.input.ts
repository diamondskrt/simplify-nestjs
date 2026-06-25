import { Field, InputType } from '@nestjs/graphql';
import { createZodDto } from 'nestjs-zod';

import { UpdateUserSchema } from '../../config';

@InputType()
export class UpdateUserInput extends createZodDto(UpdateUserSchema) {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  avatarUrl?: string;
}
