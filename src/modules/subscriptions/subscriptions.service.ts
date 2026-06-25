import { Injectable } from '@nestjs/common';

import { SubscriptionsRepository } from './subscriptions.repository';
import {
  CreateSubscription,
  IFindAllOptions,
  UpdateSubscription,
} from './types';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly repository: SubscriptionsRepository) {}

  getAllSubscriptions({
    userId,
    options,
  }: {
    userId: string;
    options: IFindAllOptions;
  }) {
    return this.repository.findAll({ userId, options });
  }

  getSubscriptionById({ userId, id }: { userId: string; id: string }) {
    return this.repository.findById({ userId, id });
  }

  createSubscription({
    userId,
    data,
  }: {
    userId: string;
    data: CreateSubscription;
  }) {
    return this.repository.create({ userId, data });
  }

  updateSubscription({
    userId,
    id,
    data,
  }: {
    userId: string;
    id: string;
    data: UpdateSubscription;
  }) {
    return this.repository.update({ userId, id, data });
  }

  deleteSubscription({ userId, id }: { userId: string; id: string }) {
    return this.repository.delete({ userId, id });
  }
}
