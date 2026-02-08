import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to protect authenticated routes.
 * Checks for next-auth session token cookies and redirects
 * unauthenticated users to the sign-in page.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for next-auth session token (both secure and non-secure variants)
  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  // If user is not authenticated, redirect to sign-in
  if (!sessionToken) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect admin routes
    "/admin/:path*",
    // Protect order routes
    "/orders/:path*",
    // Protect checkout route
    "/checkout",
  ],
};
