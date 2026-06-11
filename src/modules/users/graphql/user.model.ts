import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLUUID } from 'graphql-scalars';

@ObjectType()
export class UserModel {
  @Field(() => GraphQLUUID)
  id: string;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  avatarUrl: string;

  @Field(() => Date)
  createdAt: Date;
}
