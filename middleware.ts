import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const path = request.nextUrl.pathname;

  // Public routes
  if (
    path.startsWith("/api/auth") ||
    path === "/" ||
    path.startsWith("/for-") ||
    path.startsWith("/explore-opportunities") ||
    path.includes("/login") ||
    path.includes("/register") ||
    path.includes("/password-reset")
  ) {
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (!token) {
    return NextResponse.redirect(new URL("/player/login", request.url));
  }

  // Role-based access control
  const role = (token as any)?.role;

  if (path.startsWith("/player/") && role !== "PLAYER") {
    return NextResponse.redirect(new URL("/player/login", request.url));
  }

  if (path.startsWith("/agent/") && role !== "AGENT") {
    return NextResponse.redirect(new URL("/agent/login", request.url));
  }

  if (path.startsWith("/academy/") && role !== "ACADEMY") {
    return NextResponse.redirect(new URL("/academy/login", request.url));
  }

  if (path.startsWith("/admin/") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
};



