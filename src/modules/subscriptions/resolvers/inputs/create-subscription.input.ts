import { Field, InputType } from '@nestjs/graphql';
import { createZodDto } from 'nestjs-zod';

import {
  CreateSubscriptionSchema,
  PaymentInterval,
  SubscriptionStatus,
} from '../../config';

@InputType()
export class CreateSubscriptionInput extends createZodDto(
  CreateSubscriptionSchema
) {
  @Field({ nullable: true })
  imgUrl?: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  price: number;

  @Field(() => PaymentInterval)
  paymentInterval: PaymentInterval;

  @Field()
  paymentDate: Date;

  @Field(() => SubscriptionStatus)
  status: SubscriptionStatus;
}
