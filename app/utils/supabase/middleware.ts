import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: This refreshes the session and sets cookies properly
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log("=== MIDDLEWARE ===");
  console.log("Path:", request.nextUrl.pathname);
  console.log("User:", user?.email || "null");
  console.log(
    "Cookies:",
    request.cookies
      .getAll()
      .map((c) => c.name)
      .join(", ")
  );

  // Allow auth callback to process without interference
  if (request.nextUrl.pathname.startsWith("/auth/callback")) {
    console.log("Allowing auth callback to pass through");
    return supabaseResponse;
  }

  // Allow API routes to pass through
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return supabaseResponse;
  }

  // Handle delete account page - require authentication
  if (request.nextUrl.pathname.startsWith("/user/delete-account")) {
    if (!user) {
      console.log("No user - redirecting to register");
      const url = request.nextUrl.clone();
      url.pathname = "/register";
      url.searchParams.set("redirect", "/user/delete-account");
      return NextResponse.redirect(url);
    }
    console.log("User authenticated - allowing delete-account access");
    return supabaseResponse;
  }

  // Get profile only if user exists
  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    console.log("Profile:", profile?.first_name || "null");
    if (profileError) console.log("Profile Error:", profileError.message);
  }

  // Redirect unauthenticated users to register (except for public pages)
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/admin/dashboard/login") &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    !request.nextUrl.pathname.startsWith("/register") &&
    !request.nextUrl.pathname.startsWith("/_next") &&
    !request.nextUrl.pathname.startsWith("/api")
  ) {
    console.log("No user found - redirecting to register");
    const url = request.nextUrl.clone();
    url.pathname = "/register";
    return NextResponse.redirect(url);
  }

  console.log("=== MIDDLEWARE END ===");
  return supabaseResponse;
}
