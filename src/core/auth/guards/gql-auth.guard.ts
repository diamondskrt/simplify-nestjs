import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AuthService } from '../auth.service';
import type { IRequestContext } from '../types';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const createdGqlContext = GqlExecutionContext.create(context);

    const ctx = createdGqlContext.getContext<IRequestContext>();

    const authHeader = ctx.req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException();
    }

    const token = authHeader.replace('Bearer ', '');

    ctx.req.user = await this.authService.verifyToken(token);

    return true;
  }
}
