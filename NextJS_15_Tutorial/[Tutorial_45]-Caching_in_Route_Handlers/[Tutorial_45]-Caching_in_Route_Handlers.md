# Caching in Route Handlers

## Introduction

Route handlers in Next.js are **not cached by default**. Each request triggers fresh execution. However, for `GET` handlers that return static or rarely-changing data, you can opt into caching to improve performance and reduce server load.

## Default Behavior: No Caching

```typescript
// app/time/route.ts
export function GET() {
  const now = new Date();
  return Response.json({
    time: now.toLocaleTimeString(),
  });
}
```

Each request to `GET /time` returns the current time. Reloading the page shows a different value on every request.

## Opting Into Caching

Use the `dynamic` route segment config option to enable caching.

```typescript
// app/categories/route.ts
export const dynamic = "force-static";

const categories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Clothing" },
  { id: 3, name: "Books" },
  { id: 4, name: "Home & Garden" },
];

export function GET() {
  return Response.json(categories);
}
```

### Caching a Dynamic Route

```typescript
// app/time/route.ts
export const dynamic = "force-static";

export function GET() {
  const now = new Date();
  return Response.json({
    time: now.toLocaleTimeString(),
  });
}
```

## Development vs Production

Caching behaves differently across environments:

| Environment | Behavior |
|---|---|
| **Development** (`npm run dev`) | No caching; each request re-executes the handler |
| **Production** (`npm run build && npm run start`) | Response is cached and served to all users |

In development, even with `force-static`, the `/time` endpoint updates on every reload. To verify caching, build and start the production server.

```bash
npm run build
npm run start
```

In production, the `/time` endpoint returns the same value on every reload.

## Revalidation with generateStaticParams

For dynamic route segments, combine `generateStaticParams` with caching to pre-render routes at build time.

```typescript
// app/products/[id]/route.ts
export const dynamic = "force-static";

export async function generateStaticParams() {
  const products = await fetch("https://api.example.com/products").then((r) =>
    r.json()
  );

  return products.map((product: { id: string }) => ({
    id: product.id,
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const product = await fetch(
    `https://api.example.com/products/${params.id}`
  ).then((r) => r.json());

  return Response.json(product);
}
```

## Revalidation with revalidate

Use `revalidate` to define a time-based cache invalidation period.

```typescript
// app/categories/route.ts
export const revalidate = 3600; // Revalidate every hour
export const dynamic = "force-static";

const categories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Clothing" },
];

export async function GET() {
  // Data is cached for 3600 seconds
  return Response.json(categories);
}
```

## Route Segment Config Options

| Option | Values | Description |
|---|---|---|
| `dynamic` | `"auto"`, `"force-dynamic"`, `"force-static"`, `"error"` | Controls caching behavior |
| `revalidate` | `number` (seconds) | Time-based cache revalidation |
| `fetchCache` | `"auto"`, `"default-cache"`, `"force-cache"`, `"default-no-store"`, ... | Controls fetch request caching |

## When to Cache

| Scenario | Cache? |
|---|---|
| Static data (categories, config) | Yes |
| Data that rarely changes | Yes, with revalidation |
| User-specific data | No |
| Real-time data (time, stock prices) | No |
| Authenticated endpoints | No |

## Key Points

- Route handlers are **not cached by default**
- Use `export const dynamic = "force-static"` to enable caching on `GET` handlers
- Caching only works in production builds, not in development
- Use `revalidate` for time-based cache expiration
- Non-`GET` methods (POST, PUT, DELETE) are always dynamic
- Combine with `generateStaticParams` for pre-rendered dynamic routes

## Related Topics

- Redirects in Route Handlers
- Middleware
- Server Components and Rendering
