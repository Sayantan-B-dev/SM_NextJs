import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Avoid redirect loop: if already on /login, do nothing
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // Check for a session cookie
  const session = request.cookies.get('session')?.value;

  // If no session cookie and accessing /admin, redirect to /login
  if (!session && pathname.startsWith('/admin')) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request through
  return NextResponse.next();
}

// Only run middleware on /admin routes and /login
export const config = {
  matcher: ['/admin/:path*', '/login'],
};
