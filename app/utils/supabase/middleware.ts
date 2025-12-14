import { NextResponse, NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const publicPaths = [
    "/register",
    "/auth",
    "/api",
    "/_next",
    "/user/delete-account",
    "/account-deleted",
  ];

  if (publicPaths.some((p) => request.nextUrl.pathname.startsWith(p))) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, opts) =>
          response.cookies.set({ name, value, path: "/", ...opts }),
        remove: (name, opts) =>
          response.cookies.set({
            name,
            value: "",
            path: "/",
            maxAge: 0,
            ...opts,
          }),
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/register", request.url));
  }

  return response;
}
