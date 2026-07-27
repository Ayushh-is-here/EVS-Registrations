import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

const DEFAULT_SUPABASE_URL = 'https://znwftdisykivjvexudwe.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpud2Z0ZGlzeWtpdmp2ZXh1ZHdlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzk1MjkxMywiZXhwIjoyMDk5NTI4OTEzfQ.Pi2ltSnOzyMJvJJFiO4MwA0xBt7h0iSkr1rGx8Bx6eY';

export function getSupabase(): SupabaseClient {
  if (supabaseClient) return supabaseClient;

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || DEFAULT_SUPABASE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase credentials.');
  }

  supabaseClient = createClient(url, key);
  return supabaseClient;
}
