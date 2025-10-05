import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function middleware(request: NextRequest) {
  console.log("siuu");

  const { pathname } = request.nextUrl;

  const response = NextResponse.next();
  const origin = request.headers.get("origin");
  const authBaseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL;

  const allowedOrigins = [authBaseUrl].filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  // Manejar preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const protectedRoutes = ["/dashboard", "/operations", "/accounts"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const publicOnlyRoutes = ["/signup"];

  const isApiRoute = pathname.startsWith("/api");
  const isApiAuthRoute = pathname.startsWith("/api/auth");

  if (isApiRoute && !isApiAuthRoute && !session) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: response.headers,
    });
  }

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (session && publicOnlyRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
