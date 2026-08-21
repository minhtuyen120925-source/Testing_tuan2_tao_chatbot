import { createAdminClient } from "@supabase/server/core";
import type { Database } from "@/lib/database.types";

// Server-only: uses the Supabase secret key, never exposed to the browser.
// conversations/messages have RLS enabled with no policies, so this admin
// client is the only way to read or write chat data.
export function getSupabaseAdmin() {
  return createAdminClient<Database>();
}
