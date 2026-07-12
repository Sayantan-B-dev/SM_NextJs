# Middleware

## Introduction

Middleware in Next.js allows you to intercept and control the flow of requests and responses at a global level before they reach your routes. It is ideal for:

- Redirects and URL rewrites
- Authentication and authorization
- Header and cookie manipulation
- Bot detection and geolocation
- A/B testing and feature flags

## Setup

Create a `middleware.ts` (or `middleware.js`) file in the **root** of your `src` directory (or the project root if no `src` folder).

```
project-root/
  src/
    middleware.ts    <-- here
    app/
    ...
```

### Basic Structure

```typescript
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: "/profile",
};
```

## Approach 1: Matcher Config

Use the `config.matcher` array to specify which routes trigger the middleware.

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/profile", "/dashboard/:path*"],
};
```

Restart the dev server:

```bash
npm run dev
```

Visiting `/profile` redirects to the homepage.

### Matcher Patterns

| Pattern | Matches |
|---|---|
| `/profile` | `/profile` only |
| `/dashboard/:path*` | `/dashboard`, `/dashboard/settings`, etc. |
| `/((?!api|_next/static|favicon.ico).*)` | All routes except API routes, static files |

## Approach 2: Conditional Statements

Use `if` statements to check the request path instead of a matcher.

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/profile") {
    return NextResponse.redirect(new URL("/hello", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.rewrite(new URL("/admin", request.url));
  }
}
```

This approach gives more flexibility for complex logic.

## Rewrites vs Redirects

| Feature | `NextResponse.redirect()` | `NextResponse.rewrite()` |
|---|---|---|
| URL changes in browser | Yes | No |
| Status code | 307/308 | 200 |
| Use case | Permanent moves | URL masking, A/B testing |

## Authentication Example

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("session");

  if (!authCookie && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
```

## Header and Cookie Manipulation

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Set custom response header
  response.headers.set("X-Custom-Header", "middleware");

  // Set cookie
  response.cookies.set("visited", "true", {
    maxAge: 60 * 60 * 24,
  });

  return response;
}
```

## Visual Flow

```
Request --> Middleware --> Route Handler --> Response
                |
           [Intercept]
           - Check auth
           - Redirect
           - Rewrite
           - Add headers
           - Set cookies
```

## Multiple Middleware Conditions

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect old URLs
  if (pathname === "/old-page") {
    return NextResponse.redirect(new URL("/new-page", request.url));
  }

  // Block certain paths
  if (pathname.startsWith("/_private")) {
    return NextResponse.redirect(new URL("/404", request.url));
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");

  return response;
}
```

## Key Points

- Place `middleware.ts` in the `src/` root (not inside `app/`)
- Use `config.matcher` for declarative route matching
- Use conditional statements for complex logic
- `NextResponse.redirect()` changes the URL in the browser
- `NextResponse.rewrite()` serves different content without changing the URL
- `NextResponse.next()` continues to the intended route
- Middleware runs before every matched request

## Related Topics

- Redirects in Route Handlers
- Headers in Route Handlers
- Cookies in Route Handlers
