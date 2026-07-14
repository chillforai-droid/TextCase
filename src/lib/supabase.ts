/// <reference types="vite/client" />
import { createClient } from "@supabase/supabase-js";

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || "";
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials are not fully configured in your environment. " +
    "Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment/settings."
  );
}

// Fallback to avoid throwing fatal compile/startup errors in the browser if not configured yet
export const supabase = createClient(
  supabaseUrl || "https://placeholder-project.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
