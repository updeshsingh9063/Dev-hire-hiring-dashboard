import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

/**
 * Admin (service-role) Supabase client.
 * ONLY use in server-side API routes — never expose to the client.
 * This bypasses Row Level Security.
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
