import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { GqlAuthGuard } from './guards';

@Module({
  providers: [GqlAuthGuard, AuthService],
  exports: [GqlAuthGuard, AuthService],
})
export class AuthModule {}
