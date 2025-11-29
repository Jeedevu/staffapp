
import { createClient } from '@supabase/supabase-js';

// Access Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is missing. Emergencies will use local state only.');
}

// Mock client to prevent crashes when credentials are missing
const mockSupabase = {
    from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
        update: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
    }),
    channel: () => ({
        on: () => ({ subscribe: () => Promise.resolve({ error: null }) }),
    }),
} as any;

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : mockSupabase;
