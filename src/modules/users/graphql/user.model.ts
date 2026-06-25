import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLUUID } from 'graphql-scalars';
import { createZodDto } from 'nestjs-zod';

import { UserSchema } from '../config';

@ObjectType()
export class UserModel extends createZodDto(UserSchema) {
  @Field(() => GraphQLUUID)
  id: string;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  avatarUrl: string;
}
