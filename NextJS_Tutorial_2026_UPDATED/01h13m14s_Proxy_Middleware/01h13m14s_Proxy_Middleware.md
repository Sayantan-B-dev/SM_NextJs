# Proxy / Middleware

Middleware (named `proxy.ts` in Next.js 15 for proxy-specific use cases) allows you to run code **before** a request completes. It sits between the incoming request and the route handler, giving you a powerful hook to inspect, redirect, rewrite, or modify requests and responses.

---

## 1. What is Middleware?

Middleware is a single file at the root of your project:

```
my-app/
  middleware.ts     <-- or proxy.ts
  app/
  ...
```

It exports a single default function that receives a `NextRequest` and returns a `NextResponse`.

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return NextResponse.next();
}
```

### Naming: `middleware.ts` vs `proxy.ts`

In Next.js 15, the file can be named either `middleware.ts` or `proxy.ts`.
- `middleware.ts` is the traditional name.
- `proxy.ts` signals that the file is used primarily for proxy-like behavior (rewrites, header modification, A/B testing).

Both work identically. Use whichever name makes the intent clearer for your team.

---

## 2. The `config.matcher` Pattern

By default, middleware runs on **every** request, including static files and images. To limit it to specific paths, use `config.matcher`:

```typescript
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
```

The matcher supports full glob patterns:

| Pattern | Matches |
|---|---|
| `/admin/:path*` | `/admin`, `/admin/users`, `/admin/users/new` |
| `/api/:path*` | `/api/posts`, `/api/users` |
| `/dashboard/:path*` | `/dashboard`, `/dashboard/settings` |
| `/((?!api|_next/static|favicon.ico).*)` | All routes except API, static assets, and favicon |

### Reading the Matcher in the Middleware

Since the middleware function receives all requests (filtered by matcher), you should always verify the pathname to handle routing logic:

```typescript
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    // Admin-specific logic
  }

  return NextResponse.next();
}
```

---

## 3. Core Operations

### Redirect

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect /old-path to /new-path
  if (pathname === '/old-path') {
    return NextResponse.redirect(new URL('/new-path', request.url));
  }

  // Redirect to login if not authenticated
  const token = request.cookies.get('session')?.value;
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
```

### Rewrite

Rewrites serve a different URL to the user while internally rendering a different route. Useful for A/B testing, feature flags, or proxying to an external API.

```typescript
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // A/B test: 50% of users see /variant-b
  const cookie = request.cookies.get('ab-test');
  if (!cookie && pathname === '/') {
    const variant = Math.random() > 0.5 ? 'a' : 'b';
    const url = request.nextUrl.clone();
    url.pathname = variant === 'a' ? '/' : '/variant-b';
    const response = NextResponse.rewrite(url);
    response.cookies.set('ab-test', variant);
    return response;
  }

  return NextResponse.next();
}
```

### Modify Headers

```typescript
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', '123');
  requestHeaders.set('x-custom-header', 'hello');

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set response headers
  response.headers.set('x-request-id', crypto.randomUUID());

  return response;
}
```

### Setting Cookies

```typescript
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.cookies.set('theme', 'dark');
  response.cookies.set('visited', 'true', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return response;
}
```

---

## 4. Avoiding Redirect Loops

The most common middleware bug is redirect loops. Always check the current pathname before redirecting:

```typescript
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('session')?.value;

  // BAD: This will cause a redirect loop
  // if (!token) return NextResponse.redirect(new URL('/login', request.url));

  // GOOD: Check that we are not already on /login
  if (!token && !pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
```

Another guard pattern:

```typescript
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Already on the target page -- do not redirect
  if (pathname === '/login') {
    return NextResponse.next();
  }
  // ... rest of auth logic
}
```

---

## 5. Common Use Cases

### Authentication / Authorization

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('session')?.value;

  // Protect admin routes
  if (pathname.startsWith('/admin') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Protect API routes
  if (pathname.startsWith('/api/admin') && !token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
```

### Internationalization (i18n)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'fr', 'es', 'de'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  const cookie = request.cookies.get('locale')?.value;
  if (cookie && locales.includes(cookie)) return cookie;

  const accept = request.headers.get('accept-language');
  if (accept) {
    const lang = accept.split(',')[0].split('-')[0];
    if (locales.includes(lang)) return lang;
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)'],
};
```

### Rate Limiting

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimit = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 10 * 1000; // 10 seconds
const MAX_REQUESTS = 10;

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const now = Date.now();

  const entry = rateLimit.get(ip);
  if (!entry || now > entry.reset) {
    rateLimit.set(ip, { count: 1, reset: now + WINDOW_MS });
    return NextResponse.next();
  }

  entry.count++;
  if (entry.count > MAX_REQUESTS) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  return NextResponse.next();
}
```

### Feature Flags / A/B Testing

```typescript
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const flag = request.cookies.get('feature-new-checkout')?.value;

  if (!flag && pathname === '/checkout') {
    const isEnabled = Math.random() > 0.5;
    const url = request.nextUrl.clone();
    url.pathname = isEnabled ? '/checkout/v2' : '/checkout/v1';
    const response = NextResponse.rewrite(url);
    response.cookies.set('feature-new-checkout', String(isEnabled));
    return response;
  }

  return NextResponse.next();
}
```

---

## 6. Performance Considerations

Middleware runs on the **Edge Runtime** by default, which has these characteristics:

| Aspect | Limitation |
|---|---|
| **Runtime** | Edge (V8 isolates), not Node.js |
| **Node.js APIs** | Not available (`fs`, `crypto` extensions, `path`) |
| **Duration** | Should complete in under a few milliseconds |
| **IO operations** | Avoid heavy database queries or external API calls |

### What Is Safe in Middleware

- Cookie and header reading/writing
- URL parsing and manipulation
- JWT verification (lightweight)
- Simple redirect/rewrite logic
- Feature flag checks (from Edge Config or a quick KV lookup)

### What to Avoid in Middleware

- Database queries
- Heavy computation or crypto
- External API calls (unless critical and fast)
- Large bundle imports

For heavy logic, use Route Handlers or Server Actions instead.

---

## 7. Full Example: Auth-Protected Dashboard

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('session')?.value;

  // Allow login page and public assets
  if (
    pathname === '/login' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!token && pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Add user info to headers for downstream use
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-token', token ?? '');

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
```

---

## 8. Summary

- Middleware (`middleware.ts` / `proxy.ts`) runs before each matching request.
- Use `config.matcher` to limit which routes trigger middleware.
- Core operations: redirect, rewrite, modify headers, set cookies.
- Always guard against redirect loops by checking the current pathname.
- Common use cases: auth protection, i18n, A/B testing, rate limiting, feature flags.
- Avoid heavy computation or IO in middleware -- it runs on the Edge Runtime.
