import { getSupabase } from "./supabase";

export async function getUser(request: Request) {
  const { supabase, response } = getSupabase(request);
  const { data } = await supabase.auth.getSession();
  return { data, response };
}
