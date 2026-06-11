import { Module } from '@nestjs/common';

import { SupabaseModule } from '~/core/supabase';

import { GqlAuthGuard } from './guards';
import { AuthService } from './auth.service';

@Module({
  imports: [SupabaseModule],
  providers: [GqlAuthGuard, AuthService],
  exports: [GqlAuthGuard, AuthService],
})
export class AuthModule {}
