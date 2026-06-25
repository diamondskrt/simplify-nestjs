import { Field, ObjectType } from '@nestjs/graphql';

import { SubscriptionModel } from './subscription.model';

@ObjectType()
export class PaginatedSubscriptionModel {
  @Field(() => [SubscriptionModel])
  data: SubscriptionModel[];

  @Field(() => Number)
  totalCount: number;

  @Field(() => String, { nullable: true })
  nextCursor: string;

  @Field(() => Boolean)
  hasNextPage: boolean;
}
