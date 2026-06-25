import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser, GqlAuthGuard, type IAuthUser } from '~/core/auth';

import { UsersService } from '../users.service';

import { UpdateUserInput } from './inputs';
import { UserModel } from './user.model';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserModel)
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: IAuthUser) {
    return this.usersService.getUserById(user.id);
  }

  @Mutation(() => UserModel)
  @UseGuards(GqlAuthGuard)
  updateUser(
    @CurrentUser() user: IAuthUser,
    @Args('input')
    input: UpdateUserInput
  ) {
    return this.usersService.updateUser(user.id, input);
  }

  @Mutation(() => UserModel)
  @UseGuards(GqlAuthGuard)
  deleteUser(@CurrentUser() user: IAuthUser) {
    return this.usersService.deleteUser(user.id);
  }
}
