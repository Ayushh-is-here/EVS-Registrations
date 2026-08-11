import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

const DEFAULT_SUPABASE_URL = 'https://znwftdisykivjvexudwe.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpud2Z0ZGlzeWtpdmp2ZXh1ZHdlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzk1MjkxMywiZXhwIjoyMDk5NTI4OTEzfQ.Pi2ltSnOzyMJvJJFiO4MwA0xBt7h0iSkr1rGx8Bx6eY';

export function getFrontendSupabase(): SupabaseClient | null {
  if (client) return client;

  const url = (import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.VITE_SUPABASE_KEY || DEFAULT_SUPABASE_KEY;

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
