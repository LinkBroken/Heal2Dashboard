"use server";

import { createClient } from "@supabase/supabase-js";

export async function googleLoginAction() {
  const baseUrl = "https://heal2-dashboard.vercel.app";
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${baseUrl}/api/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) throw console.log(error);
  console.log(data);
  return data.url; // Return redirect URL
}
