import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let browserClient: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  browserClient = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabaseClient = browserClient;
