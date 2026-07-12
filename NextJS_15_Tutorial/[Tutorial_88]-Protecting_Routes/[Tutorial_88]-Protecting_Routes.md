## Protecting Routes

Route protection ensures that only authenticated users can access certain pages. Clerk's middleware provides the most robust way to protect routes in Next.js.

### Why Middleware?

Without route protection, unauthenticated users navigating to protected pages (e.g., `/user-profile`) encounter Clerk runtime errors like:

```
UserProfile cannot render unless a user is signed in.
```

### Protecting Specific Routes

Use `clerkMiddleware` with `createRouteMatcher` to protect individual routes:

```typescript
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/user-profile(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

### Inverted: Defining Public Routes

Instead of protected routes, define which routes are public and protect everything else:

```typescript
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

### How It Works

1. A request comes in for a route (e.g., `/user-profile`).
2. The middleware checks if the route matches the protected/public pattern.
3. If the route is protected and the user is unauthenticated, `auth.protect()` redirects to the Clerk sign-in page.
4. After successful sign-in, Clerk redirects the user back to the originally requested route.

### Redirect Behavior

| User State | Protected Route | Result |
|------------|----------------|--------|
| Signed in | Visits `/user-profile` | Page renders normally |
| Signed out | Visits `/user-profile` | Redirected to Clerk sign-in page, then back to `/user-profile` after sign-in |
| Signed out | Visits public route (e.g., `/`) | Page renders normally |

### Protecting API Routes

The middleware also protects API routes automatically based on the same matcher configuration:

```typescript
// Protect all API routes
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)", "/api/webhooks(.*)"]);
```

### Additional Middleware Options

```typescript
// Custom redirect URL after sign-in
await auth.protect({
  unauthenticatedUrl: "/custom-sign-in",
});

// Custom redirect URL for unauthorized users
await auth.protect({
  unauthorizedUrl: "/unauthorized",
});
```
