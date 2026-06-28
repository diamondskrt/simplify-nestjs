import { Field, InputType } from '@nestjs/graphql';
import { createZodDto } from 'nestjs-zod';

import {
  PaymentInterval,
  SubscriptionStatus,
  UpdateSubscriptionSchema,
} from '../../config';

@InputType()
export class UpdateSubscriptionInput extends createZodDto(
  UpdateSubscriptionSchema
) {
  @Field({ nullable: true })
  imgUrl?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  price?: number;

  @Field(() => PaymentInterval, { nullable: true })
  paymentInterval?: PaymentInterval;

  @Field({ nullable: true })
  paymentDate?: Date;

  @Field(() => SubscriptionStatus, { nullable: true })
  status?: SubscriptionStatus;
}
