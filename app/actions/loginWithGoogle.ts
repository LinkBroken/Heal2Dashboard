"use server";

import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

export async function googleLoginAction(redirectPath: string = "/api/auth/callback") {
  // Dynamically determine the base URL from request headers (headers() is async in Next.js 15)
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const baseUrl = `${protocol}://${host}`;

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
