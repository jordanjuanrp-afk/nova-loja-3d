import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vwtadgquogjvoxvvdvbg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3dGFkZ3F1b2dqdm94dnZkdmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDAwODksImV4cCI6MjA4OTk3NjA4OX0.ssREYLERQVIqxchemYOtai80NI0-YpQem77O5LL1Ywk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
