# Cookies in Route Handlers

## Introduction

Cookies are small pieces of data stored by the browser and sent to the server with each request. They serve three main purposes:

| Purpose | Description |
|---|---|
| Session management | Logins, shopping carts, game scores |
| Personalization | User preferences, themes, language |
| Tracking | Recording and analyzing user behavior |

## Setting and Reading Cookies

There are two approaches to work with cookies in Next.js route handlers.

### Approach 1: Using the Set-Cookie Header

Set a cookie by including a `Set-Cookie` header in the response.

```typescript
export function GET() {
  const headers = new Headers();
  headers.set("Content-Type", "text/html");
  headers.set("Set-Cookie", "theme=dark; Path=/");

  return new Response("Cookie set", { headers });
}
```

Read the cookie from the request object.

```typescript
import { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const theme = request.cookies.get("theme");
  console.log("Cookie value:", theme); // { name: "theme", value: "dark" }

  return Response.json({ theme: theme?.value });
}
```

### Approach 2: Using the cookies() Helper

Next.js provides a built-in `cookies()` function from `next/headers`.

```typescript
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();

  // Get a cookie
  const theme = cookieStore.get("theme");
  console.log(theme);

  // Get all cookies
  const allCookies = cookieStore.getAll();
  console.log(allCookies);

  return Response.json({
    theme: theme?.value,
    all: allCookies,
  });
}
```

## Setting Cookies with cookies() Helper

The `cookies()` helper also allows setting cookies.

```typescript
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();

  // Set a cookie
  cookieStore.set("theme", "dark");
  cookieStore.set("preferences", JSON.stringify({ lang: "en", fontSize: 16 }));

  // Delete a cookie
  cookieStore.delete("old-cookie");

  return Response.json({ message: "Cookies updated" });
}
```

## Cookie Options

When setting cookies, you can pass additional options:

| Option | Description | Example |
|---|---|---|
| `httpOnly` | Not accessible via JavaScript | `true` |
| `secure` | Only sent over HTTPS | `true` |
| `sameSite` | Cross-site request behavior | `"lax"`, `"strict"`, `"none"` |
| `maxAge` | Time to live in seconds | `3600` |
| `path` | URL path scope | `"/"`, `"/api"` |
| `domain` | Domain scope | `"example.com"` |

```typescript
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();

  cookieStore.set("session", "abc123", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });

  return Response.json({ message: "Secure cookie set" });
}
```

## Visual Comparison of Approaches

```
Approach 1: Set-Cookie Header
  Response.set("Set-Cookie", "theme=dark")
  Request.cookies.get("theme")

Approach 2: cookies() Helper
  cookies().set("theme", "dark")
  cookies().get("theme")
```

## Checking for Cookie Existence

```typescript
import { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const hasTheme = request.cookies.has("theme");

  if (!hasTheme) {
    const headers = new Headers();
    headers.set("Set-Cookie", "theme=light; Path=/");
    return new Response("Default theme set", { headers });
  }

  const theme = request.cookies.get("theme");
  return Response.json({ theme: theme.value });
}
```

## Key Points

- Two approaches: raw `Set-Cookie` header or `cookies()` helper from `next/headers`
- `cookies()` is an async function and must be awaited
- Use `cookies().get(name)` to read a single cookie
- Use `cookies().set(name, value, options)` to set a cookie with options
- Use `cookies().delete(name)` to remove a cookie
- Cookies are automatically included in the `Set-Cookie` header when using the helper

## Related Topics

- Headers in Route Handlers
- Redirects in Route Handlers
- Middleware
