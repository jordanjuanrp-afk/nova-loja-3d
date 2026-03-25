import { createClient } from '@supabase/supabase-js';

// Fallback values provided by the user for immediate integration
const DEFAULT_URL = 'https://vwtadgquogjvoxvvdvbg.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3dGFkZ3F1b2dqdm94dnZkdmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDAwODksImV4cCI6MjA4OTk3NjA4OX0.ssREYLERQVIqxchemYOtai80NI0-YpQem77O5LL1Ywk';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'Cache-Control': 'no-cache'
    }
  }
});
