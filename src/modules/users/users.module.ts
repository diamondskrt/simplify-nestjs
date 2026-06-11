import { Global, Module } from '@nestjs/common';

import { AuthModule } from '~/core/auth';

import { UsersResolver } from './graphql';
import { UsersService } from './users.service';

@Global()
@Module({
  imports: [AuthModule],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
