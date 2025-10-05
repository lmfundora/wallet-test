import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function middleware(request: NextRequest) {
  console.log("siuu");

  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Define protected routes that require authentication
  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Define public-only routes (e.g., login, signup)
  // Users who are logged in should be redirected from these pages
  const publicOnlyRoutes = ["/signup"];

  // API Route Protection
  const isApiRoute = pathname.startsWith("/api");
  const isApiAuthRoute = pathname.startsWith("/api/auth");

  if (isApiRoute && !isApiAuthRoute && !session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Protected Route Logic
  if (isProtectedRoute && !session) {
    // Redirect unauthenticated users trying to access protected routes to the homepage
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Public-Only Route Logic
  if (session && publicOnlyRoutes.includes(pathname)) {
    // Redirect authenticated users away from public-only pages to the dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
