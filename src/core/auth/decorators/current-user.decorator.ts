import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IRequestContext } from '../types';

const CurrentContext = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const createdGqlContext = GqlExecutionContext.create(context);
    const ctx = createdGqlContext.getContext<IRequestContext>();

    return {
      user: ctx.req.user,
      supabase: ctx.req.supabase,
    };
  },
);

export { CurrentContext };
