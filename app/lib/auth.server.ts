import { type AppLoadContext } from "@remix-run/cloudflare";
import { getSupabase } from "./supabase";

export async function getUser(request: Request, context: AppLoadContext) {
  const { supabase, response } = getSupabase(request, context);
  const { data } = await supabase.auth.getSession();
  return { data, response };
}
