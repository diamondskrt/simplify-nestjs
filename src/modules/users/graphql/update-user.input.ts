import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}
