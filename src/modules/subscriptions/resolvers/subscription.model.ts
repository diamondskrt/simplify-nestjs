import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GraphQLDate, GraphQLUUID } from 'graphql-scalars';
import { createZodDto } from 'nestjs-zod';

import {
  PaymentInterval,
  SortBy,
  SubscriptionSchema,
  SubscriptionStatus,
} from '../config';

registerEnumType(SortBy, {
  name: 'SortBy',
  description: 'The sortBy at which the subscription is sorted',
});

registerEnumType(PaymentInterval, {
  name: 'PaymentInterval',
  description: 'The interval at which the subscription is billed',
});

registerEnumType(SubscriptionStatus, {
  name: 'SubscriptionStatus',
  description: 'The current status of the subscription',
});

@ObjectType()
export class SubscriptionModel extends createZodDto(SubscriptionSchema) {
  @Field(() => GraphQLUUID)
  id: string;

  @Field(() => GraphQLUUID)
  userId: string;

  @Field({ nullable: true })
  imgUrl: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  price: number;

  @Field(() => PaymentInterval)
  paymentInterval: PaymentInterval;

  @Field(() => GraphQLDate)
  paymentDate: Date;

  @Field(() => GraphQLDate, { nullable: true })
  nextBillingDate: Date;

  @Field(() => SubscriptionStatus)
  status: SubscriptionStatus;

  @Field(() => GraphQLDate)
  createdAt: Date;

  @Field(() => GraphQLDate)
  updatedAt: Date;
}
