import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '~/shared/database';

type TypedSupabaseClient = SupabaseClient<Database>;

export type { TypedSupabaseClient };
