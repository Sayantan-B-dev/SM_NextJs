# Redirects in Route Handlers

## Introduction

Redirects instruct the client to navigate to a different URL. This is useful when migrating API versions, moving endpoints, or enforcing authentication. Next.js provides the `redirect()` function from `next/navigation` for route handler redirects.

## Using redirect()

Import `redirect` and call it with the target path.

```typescript
import { redirect } from "next/navigation";

export function GET() {
  redirect("/api/v2/users");
}
```

The browser receives a **307 (Temporary Redirect)** status code and navigates to the new URL.

## Use Case: API Version Migration

Imagine a V1 endpoint that has been running for months:

```typescript
// app/api/v1/users/route.ts
import { redirect } from "next/navigation";

export function GET() {
  redirect("/api/v2/users");
}
```

### V1 Response Shape

```json
{
  "id": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### V2 Response Shape

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": {
    "first": "John",
    "last": "Doe"
  },
  "preferences": {
    "theme": "dark",
    "language": "en"
  },
  "profileData": { ... },
  "createdAt": "2024-01-01T00:00:00Z"
}
```

V1 fields are preserved in V2 (additive only). Existing clients continue working, and new clients can use the enhanced data.

## Redirect Status Codes

| Function | Status Code | Behavior |
|---|---|---|
| `redirect()` | 307 (Temporary) | Browser may use original method on next request |
| `permanentRedirect()` | 308 (Permanent) | Browser caches the redirect and skips the original URL |

```typescript
import { permanentRedirect } from "next/navigation";

export function GET() {
  permanentRedirect("/api/v2/users");
  // 308 Permanent Redirect -- browsers cache this
}
```

## Conditional Redirects

Redirect based on request properties like headers or query parameters.

```typescript
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

export function GET(request: NextRequest) {
  const version = request.nextUrl.searchParams.get("version");

  if (version === "v2") {
    redirect("/api/v2/users");
  }

  if (version === "v3") {
    redirect("/api/v3/users");
  }

  return Response.json({ message: "V1 response" });
}
```

## Redirect Outside Route Handlers

The `redirect()` function is also available in Server Components and Server Actions.

```tsx
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <div>Welcome, {user.name}</div>;
}
```

## Visual Flow

```
Client                          Server
  |                               |
  |-- GET /api/v1/users --------->|
  |                               |  redirect("/api/v2/users")
  |<-- 307 Temporary Redirect ----|
  |    Location: /api/v2/users    |
  |                               |
  |-- GET /api/v2/users --------->|
  |                               |  Return V2 data
  |<-- 200 OK --------------------|
```

## Key Points

- Import `redirect` from `next/navigation` (not `next/server`)
- `redirect()` sends a 307 Temporary Redirect by default
- Use `permanentRedirect()` for 308 Permanent Redirect
- Call `redirect()` before any response is sent
- Works in route handlers, Server Components, and Server Actions
- Include the leading slash in the path

## Related Topics

- Caching in Route Handlers
- Middleware
- Headers in Route Handlers
