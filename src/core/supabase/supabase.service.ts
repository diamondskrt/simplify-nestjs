import { Injectable } from '@nestjs/common';

import type { TypedSupabaseClient } from './types';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  constructor(private readonly configService: ConfigService) {}

  getClient(accessToken?: string): TypedSupabaseClient {
    return createClient(
      this.configService.getOrThrow('SUPABASE_URL'),
      this.configService.getOrThrow('SUPABASE_PUBLISHABLE_KEY'),
      {
        global: accessToken
          ? {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          : undefined,
      },
    );
  }
}
