"use server";

import { createClient } from "@supabase/supabase-js";

export async function googleLoginAction(redirectPath: string = "/api/auth/callback") {
  // Try to use the public base URL from env, stripping /api if present
  const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://heal2-dashboard.vercel.app";
  const baseUrl = rawBaseUrl.replace(/\/api$/, "");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${baseUrl}${redirectPath}`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error("Supabase OAuth error:", error);
    throw error;
  }
  
  console.log("OAuth sign-in data:", data);
  return data.url; // Return redirect URL
}
