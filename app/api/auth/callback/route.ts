import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirect =
    requestUrl.searchParams.get("redirect") || "/user/delete-account";
  const origin = requestUrl.origin;

  console.log("=== AUTH CALLBACK START ===");
  console.log("Code:", code ? "Present" : "Missing");
  console.log("Full URL:", request.url);

  // If there's no code, it means tokens are in the hash fragment
  // We need to handle this on the client side
  if (!code) {
    console.log("No code found - tokens likely in hash fragment");
    console.log("Redirecting to client-side handler");

    // Return an HTML page that will handle the hash fragment
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Completing sign in...</title>
        </head>
        <body>
          <p>Completing sign in...</p>
          <script>
            // Get the hash fragment which contains the tokens
            const hash = window.location.hash.substring(1);
            const params = new URLSearchParams(hash);
            
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            
            console.log('Access token:', accessToken ? 'Present' : 'Missing');
            console.log('Refresh token:', refreshToken ? 'Present' : 'Missing');
            
            if (accessToken && refreshToken) {
              // Store tokens and redirect
              fetch('/api/auth/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  access_token: accessToken,
                  refresh_token: refreshToken
                })
              }).then(() => {
                window.location.href = '${redirect}';
              }).catch(err => {
                console.error('Failed to set session:', err);
                window.location.href = '/register?error=session_failed';
              });
            } else {
              console.error('Missing tokens in hash');
              window.location.href = '/register?error=no_tokens';
            }
          </script>
        </body>
      </html>
      `,
      {
        headers: { "Content-Type": "text/html" },
      }
    );
  }

  // Handle PKCE flow (with code parameter)
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  console.log("Session created:", !!data.session);
  console.log("User email:", data.user?.email);
  console.log("Error:", error?.message || "None");
  console.log("=== AUTH CALLBACK END ===");

  if (error || !data.session) {
    return NextResponse.redirect(`${origin}/register?error=auth_failed`);
  }

  return NextResponse.redirect(`${origin}${redirect}`);
}
