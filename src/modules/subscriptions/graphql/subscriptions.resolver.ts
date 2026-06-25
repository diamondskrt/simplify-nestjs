import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLUUID } from 'graphql-scalars';

import { CurrentUser, GqlAuthGuard, type IAuthUser } from '~/core/auth';

import { SubscriptionsService } from '../subscriptions.service';

import {
  CreateSubscriptionInput,
  CursorPaginationOptionsInput,
  UpdateSubscriptionInput,
} from './inputs';
import { PaginatedSubscriptionModel } from './paginated-subscription.model';
import { SubscriptionModel } from './subscription.model';

@Resolver(() => SubscriptionModel)
export class SubscriptionsResolver {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Query(() => PaginatedSubscriptionModel)
  @UseGuards(GqlAuthGuard)
  getAllSubscriptions(
    @CurrentUser() user: IAuthUser,
    @Args('options', { nullable: true })
    options?: CursorPaginationOptionsInput
  ) {
    return this.subscriptionsService.getAllSubscriptions({
      userId: user.id,
      options,
    });
  }

  @Query(() => SubscriptionModel)
  @UseGuards(GqlAuthGuard)
  getSubscriptionById(
    @CurrentUser() user: IAuthUser,
    @Args('id', { type: () => GraphQLUUID }) id: string
  ) {
    return this.subscriptionsService.getSubscriptionById({
      userId: user.id,
      id,
    });
  }

  @Mutation(() => SubscriptionModel)
  @UseGuards(GqlAuthGuard)
  createSubscription(
    @CurrentUser() user: IAuthUser,
    @Args('input') input: CreateSubscriptionInput
  ) {
    return this.subscriptionsService.createSubscription({
      userId: user.id,
      data: input,
    });
  }

  @Mutation(() => SubscriptionModel)
  @UseGuards(GqlAuthGuard)
  updateSubscription(
    @CurrentUser() user: IAuthUser,
    @Args('id', { type: () => GraphQLUUID })
    id: string,
    @Args('input')
    input: UpdateSubscriptionInput
  ) {
    return this.subscriptionsService.updateSubscription({
      userId: user.id,
      id,
      data: input,
    });
  }

  @Mutation(() => SubscriptionModel)
  @UseGuards(GqlAuthGuard)
  deleteSubscription(
    @CurrentUser() user: IAuthUser,
    @Args('id', { type: () => GraphQLUUID }) id: string
  ) {
    return this.subscriptionsService.deleteSubscription({
      userId: user.id,
      id,
    });
  }
}
