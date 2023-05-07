import { createServerClient as csc } from "@supabase/auth-helpers-remix";

export const getSupabase = (request: Request) => {
  const response = new Response();
  return {
    supabase: csc(
      "https://pivlgmzzjgsysyvmsgjy.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpdmxnbXp6amdzeXN5dm1zZ2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTMyNTM3NDUsImV4cCI6MTk2ODgyOTc0NX0.sSMLicGE_LCmu1YidlnHFqwNnNj4K2CCfJUiTHc3muA",

      {
        request,
        response,
      }
    ),
    response,
  };
};

export const createServerClient = ({
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  request,
  response,
}: {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  request: Request;
  response: Response;
}) => {
  return csc(
    // "https://pivlgmzzjgsysyvmsgjy.supabase.co",
    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpdmxnbXp6amdzeXN5dm1zZ2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTMyNTM3NDUsImV4cCI6MTk2ODgyOTc0NX0.sSMLicGE_LCmu1YidlnHFqwNnNj4K2CCfJUiTHc3muA",
    SUPABASE_URL,
    SUPABASE_ANON_KEY,

    {
      request,
      response,
    }
  );
};
