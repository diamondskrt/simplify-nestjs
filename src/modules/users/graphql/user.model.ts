import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field(() => Date)
  createdAt: Date;
}
