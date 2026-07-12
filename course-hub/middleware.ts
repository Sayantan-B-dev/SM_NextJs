import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log(`[Middleware] ${request.method} ${request.nextUrl.pathname}`);

  if (
    request.nextUrl.pathname.startsWith("/course-2/middleware-demo/admin") &&
    request.nextUrl.searchParams.get("role") !== "admin"
  ) {
    return NextResponse.redirect(new URL("/course-2/middleware-demo", request.url));
  }
}

export const config = {
  matcher: "/course-2/:path*",
};
