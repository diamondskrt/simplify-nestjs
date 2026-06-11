import { Global, Module } from '@nestjs/common';

import { AuthModule } from '~/core/auth';
import { PrismaModule } from '~/core/prisma';

import { UsersResolver } from './graphql';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Global()
@Module({
  imports: [AuthModule, PrismaModule],
  providers: [UsersResolver, UsersService, UsersRepository],
})
export class UsersModule {}
