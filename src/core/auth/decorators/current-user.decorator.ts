import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import type { IRequestContext } from '../types';

const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const createdGqlContext = GqlExecutionContext.create(context);
    const ctx = createdGqlContext.getContext<IRequestContext>();

    return ctx.req.user;
  }
);

export { CurrentUser };
