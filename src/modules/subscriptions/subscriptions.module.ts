import { Global, Module } from '@nestjs/common';

import { AuthModule } from '~/core/auth';
import { PrismaModule } from '~/core/prisma';

import { SubscriptionsResolver } from './resolvers';
import { SubscriptionsRepository } from './subscriptions.repository';
import { SubscriptionsService } from './subscriptions.service';

@Global()
@Module({
  imports: [AuthModule, PrismaModule],
  providers: [
    SubscriptionsResolver,
    SubscriptionsService,
    SubscriptionsRepository,
  ],
})
export class SubscriptionsModule {}
