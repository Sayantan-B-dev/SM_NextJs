# Route Handlers

## Overview

Route handlers allow you to create custom request handlers for your routes, enabling RESTful API endpoints without setting up a separate server. Unlike page routes (which return HTML), route handlers give full control over the response.

### Supported HTTP Methods

| Method   | Description |
|----------|-------------|
| `GET`    | Retrieve data |
| `POST`   | Create a resource |
| `PUT`    | Replace a resource |
| `PATCH`  | Partially update a resource |
| `DELETE` | Remove a resource |
| `HEAD`   | Retrieve headers only |
| `OPTIONS` | Describe available methods |

Calling an unsupported method returns a `405 Method Not Allowed` response.

## Creating a Route Handler

### Basic Structure

Route handlers are defined in `route.ts` (or `route.js`) files inside the `app` directory. Each exported function name must match the HTTP verb.

**`app/hello/route.ts`**:

```typescript
export async function GET() {
  return new Response("Hello World");
}
```

Visit `localhost:3000/hello` to see the plain text response.

### Returning JSON

Use `Response.json()` to return structured data:

```typescript
export async function GET() {
  return Response.json({ message: "Hello World" });
}
```

## Organization

Route handlers can be nested in folders, just like page routes:

```
app/
  hello/
    route.ts
  dashboard/
    route.ts
    users/
      route.ts
```

- `GET /hello` -- returns "Hello World"
- `GET /dashboard` -- returns dashboard data
- `GET /dashboard/users` -- returns user data

## Route Handler vs Page Route Conflicts

If a `route.ts` and `page.tsx` exist at the same route segment, the route handler takes precedence.

### Problem

```
app/
  profile/
    page.tsx        # Renders <ProfilePage />
    route.ts        # GET handler returns "Profile API data"
```

Visiting `/profile` returns "Profile API data" instead of the page component.

### Solution

Move the route handler into an `api` subfolder:

```
app/
  profile/
    page.tsx
    api/
      route.ts
```

Now:
- `GET /profile` -- renders the profile page
- `GET /profile/api` -- returns the API data

## Complete Example

**`app/hello/route.ts`**:

```typescript
export async function GET() {
  return new Response("Hello World");
}
```

**`app/dashboard/route.ts`**:

```typescript
export async function GET() {
  return Response.json({ data: "Dashboard data" });
}
```

**`app/dashboard/users/route.ts`**:

```typescript
export async function GET() {
  return Response.json({ data: "User data" });
}
```

## Key Points

- Route handlers live in `route.ts` files within the `app` directory
- Export async functions named after HTTP methods (`GET`, `POST`, `PATCH`, `DELETE`, etc.)
- Use the standard `Response` or `Response.json()` for responses
- Route handlers at the same segment as a page route will take precedence over the page
- Sensitive information (API keys, secrets) stays server-side and never reaches the browser
