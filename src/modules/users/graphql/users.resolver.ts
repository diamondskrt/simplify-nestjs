import { GraphQLUUID } from 'graphql-scalars';

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import {
  CurrentContext,
  GqlAuthGuard,
  type ICurrentContext,
} from '~/core/auth';

import { UsersService } from '../users.service';

import { UserModel } from './user.model';
import { UpdateUserInput } from './update-user.input';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserModel])
  @UseGuards(GqlAuthGuard)
  users(
    @CurrentContext()
    ctx: ICurrentContext,
  ) {
    return this.usersService.getUsers(ctx);
  }

  @Query(() => UserModel)
  @UseGuards(GqlAuthGuard)
  getUserById(
    @CurrentContext()
    ctx: ICurrentContext,
    @Args('id', { type: () => GraphQLUUID }) id: string,
  ) {
    return this.usersService.getUserById(ctx, id);
  }

  @Mutation(() => UserModel)
  @UseGuards(GqlAuthGuard)
  updateUser(
    @CurrentContext()
    ctx: ICurrentContext,
    @Args('id', { type: () => GraphQLUUID }) id: string,
    @Args('input')
    input: UpdateUserInput,
  ) {
    return this.usersService.updateUser(ctx, id, input);
  }

  @Mutation(() => UserModel)
  @UseGuards(GqlAuthGuard)
  deleteUser(
    @CurrentContext()
    ctx: ICurrentContext,
    @Args('id', { type: () => GraphQLUUID }) id: string,
  ) {
    return this.usersService.deleteUser(ctx, id);
  }
}
