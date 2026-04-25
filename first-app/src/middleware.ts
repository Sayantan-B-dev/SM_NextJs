import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'

/*START

User requests a route

Fetch JWT token using getToken()

Store current URL path

CHECK:
    Is user already logged in?
        token exists → YES
        token exists → NO

IF token exists:
    Check if user is trying to access:
        /sign-in
        /sign-up
        /verify
        /

    IF yes:
        redirect user → /dashboard

IF token does not exist:
    allow normal route flow

Protected routes handled through matcher:
    /sign-in
    /sign-up
    /
    /dashboard/*
    /verify/*

END */
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const url = request.nextUrl

    if (token && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname.startsWith('/')
    )) {
        return NextResponse.redirect(new URL('/dashboard', request.url))

    }

}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
}