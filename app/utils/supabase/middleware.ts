import { NextResponse, NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          response.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // 👇 FIXED: Added /user/delete-account
  const isPublicPath =
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname.startsWith("/register") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/user/delete-account") ||
    request.nextUrl.pathname === "/account-deleted";

  if (isPublicPath) return response;

  // --- AUTH CHECK ---
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/register", request.url));
  }

  // --- GET PROFILE ---
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.redirect(new URL("/register", request.url));
  }

  // --- ROLE LOGIC ---
  switch (profile.role) {
    case "admin":
      if (request.nextUrl.pathname !== "/") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      break;

    default:
      if (!request.nextUrl.pathname.startsWith("/user/delete-account")) {
        return NextResponse.redirect(
          new URL("/user/delete-account", request.url)
        );
      }
      break;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
