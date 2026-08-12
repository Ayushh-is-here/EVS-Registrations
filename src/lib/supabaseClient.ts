import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

const DEFAULT_SUPABASE_URL = 'https://znwftdisykivjvexudwe.supabase.co';

export function getFrontendSupabase(): SupabaseClient | null {
  if (client) return client;

  const url = (import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.VITE_SUPABASE_KEY;

  if (!url || !key) {
    return null;
  }

  try {
    client = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      }
    });
    return client;
  } catch (err) {
    console.error('Failed to initialize frontend Supabase client:', err);
    return null;
  }
}
