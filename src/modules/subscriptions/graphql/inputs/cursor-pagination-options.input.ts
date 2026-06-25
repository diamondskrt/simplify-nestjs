import { Field, InputType, Int } from '@nestjs/graphql';

import { PaymentInterval, SortBy, SubscriptionStatus } from '../../config';

@InputType()
export class CursorPaginationOptionsInput {
  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => String, { nullable: true })
  after?: string;

  @Field(() => String, { nullable: true })
  sortOrder?: 'asc' | 'desc';

  @Field(() => String, { nullable: true })
  search?: string;

  @Field(() => SortBy, { nullable: true })
  sortBy?: SortBy;

  @Field(() => PaymentInterval, { nullable: true })
  paymentInterval?: PaymentInterval;

  @Field(() => SubscriptionStatus, { nullable: true })
  status?: SubscriptionStatus;
}
