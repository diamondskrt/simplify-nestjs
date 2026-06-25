import z from 'zod';

import { IBasePaginationOptions } from '~/shared/types';

import {
  CreateSubscriptionSchema,
  PaymentInterval,
  SortBy,
  SubscriptionSchema,
  SubscriptionStatus,
  UpdateSubscriptionSchema,
} from '../config';

type CreateSubscription = z.infer<typeof CreateSubscriptionSchema>;

type UpdateSubscription = z.infer<typeof UpdateSubscriptionSchema>;

type Subscription = z.infer<typeof SubscriptionSchema>;

interface IFindAllOptions extends IBasePaginationOptions {
  sortBy?: SortBy;
  paymentInterval?: PaymentInterval | null;
  status?: SubscriptionStatus | null;
}

export type {
  CreateSubscription,
  UpdateSubscription,
  Subscription,
  IFindAllOptions,
};
