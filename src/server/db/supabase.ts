import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getEnv, requireEnv } from "@/server/env";

let serviceClient: SupabaseClient | undefined;

export function getServiceSupabase() {
  if (!serviceClient) {
    serviceClient = createClient(requireEnv("NEXT_PUBLIC_SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
      auth: { persistSession: false }
    });
  }
  return serviceClient;
}

export function hasSupabaseConfig() {
  const env = getEnv();
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}
