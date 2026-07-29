// Server-only Supabase client for the /decode puzzle. Uses the service-role
// key, so this must never be imported from a client component — only from
// pages/api/*.ts (Node.js runtime, never bundled to the browser).
import { createClient } from '@supabase/supabase-js';

type Database = {
  public: {
    Tables: {
      puzzle_theories: {
        Row: { id: number; created_at: string; content: string; stage: number; is_correct: boolean; visitor_key: string | null };
        Insert: { content: string; stage: number; is_correct?: boolean; visitor_key?: string | null };
        Update: Partial<{ content: string; stage: number; is_correct: boolean; visitor_key: string | null }>;
        Relationships: [];
      };
      puzzle_state: {
        Row: { id: number; current_stage: number; stage_solved_at: Record<string, string>; updated_at: string };
        Insert: { id: number; current_stage?: number; stage_solved_at?: Record<string, string>; updated_at?: string };
        Update: Partial<{ current_stage: number; stage_solved_at: Record<string, string>; updated_at: string }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

let client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabase() {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set');
  client = createClient<Database>(url, key, { auth: { persistSession: false } });
  return client;
}
