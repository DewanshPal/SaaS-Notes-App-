import { NextResponse, NextRequest } from "next/server";

// Middleware function
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public routes
  const isPublicPath = path === "/sign-in" || path === "/sign-up";

  // Get token & role from cookies
  const token = request.cookies.get("token")?.value || "";
  const role = request.cookies.get("role")?.value || ""; // "admin" or "member"

  // If user is logged in and tries to access login/signup, redirect to home
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If not logged in and trying to access protected routes, redirect to login
  if (!isPublicPath && !token) {
    if(role == "ADMIN")
    {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard/member", request.url));
  }

  // Role-based protection
  if (path.startsWith("/dashboard/admin") && role !== "ADMIN") {
    // Member trying to access admin page
    return NextResponse.redirect(new URL("/dashboard/member", request.url));
  }

  if (path.startsWith("/dashboard/member") && role !== "MEMBER") {
    // Admin trying to access member page
    return NextResponse.redirect(new URL("/dashboard/admin", request.url));
  }

  return NextResponse.next();
}

// Paths to apply middleware
export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/dashboard/:path*", // Protect dashboard routes
  ],
};
