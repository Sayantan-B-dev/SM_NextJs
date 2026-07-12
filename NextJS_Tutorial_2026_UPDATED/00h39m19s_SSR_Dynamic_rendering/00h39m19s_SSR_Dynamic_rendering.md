# SSR - Dynamic Rendering

Dynamic Rendering (SSR) is the strategy Next.js uses when a page cannot be pre-rendered at build time because it depends on request-time data, such as cookies, headers, or search parameters.

## When Next.js Opts Into Dynamic Rendering

A route becomes dynamic automatically when any of the following are present:

| API / Configuration          | Effect                                                   |
|------------------------------|----------------------------------------------------------|
| `cookies()`                  | Reads request cookies, requires dynamic rendering        |
| `headers()`                  | Reads request headers, requires dynamic rendering        |
| `searchParams`               | Page receives search params as a prop (makes it dynamic) |
| `dynamic = 'force-dynamic'`  | Forces the route to be dynamic                           |
| `revalidate = 0`             | Disables caching, forces dynamic render                  |
| `noStore()`                  | Opts out of static caching for the current scope         |
| `fetch()` with `cache: 'no-store'` | Disables fetch caching, may make parent page dynamic    |

### Example: Dynamic Page with searchParams

```typescript
// app/search/page.tsx
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const results = q
    ? await fetch(`https://api.example.com/search?q=${q}`, {
        cache: 'no-store',
      }).then((r) => r.json())
    : [];

  return (
    <div>
      <h1>Search Results for "{q}"</h1>
      <ul>
        {results.map((item: { id: number; name: string }) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Example: Dynamic Page with cookies()

```typescript
// app/dashboard/page.tsx
import { cookies } from 'next/headers';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value ?? 'light';

  return (
    <div className={theme}>
      <h1>Dashboard</h1>
      <p>Your theme preference: {theme}</p>
    </div>
  );
}
```

## Lambda Icon in Build Output

When you run `npm run build`, dynamic routes show the lambda (f) icon:

```
Route (app)                              Size     First Load JS
+  /dashboard                              ?          84.9 kB      <-- f (lambda): dynamic
+  /search                                 ?          85.2 kB      <-- f (lambda): dynamic
+  /posts                                  6 kB        90 kB        <-- circle: static
```

The lambda icon means this route is rendered on-demand on the server for each request.

## generateStaticParams for Pre-Generating Dynamic Routes

When dealing with routes that have dynamic segments and a large number of possible values, you can use `generateStaticParams` to pre-render specific paths at build time, while leaving others to be rendered on-demand.

```typescript
// app/products/[id]/page.tsx
export async function generateStaticParams() {
  // Fetch only the most popular products to pre-render
  const products = await fetch('https://api.example.com/products/popular')
    .then((r) => r.json());

  return products.map((product: { id: number }) => ({
    id: String(product.id),
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetch(`https://api.example.com/products/${id}`)
    .then((r) => r.json());

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
    </div>
  );
}
```

Without `generateStaticParams`, all requests to `/products/[id]` would be dynamic. With it, the popular products are pre-rendered statically at build time, and the rest are still rendered on-demand.

## Comparison of All Rendering Strategies

| Strategy | Acronym | Rendering Time | Data Freshness | Use Case                              | Build Output Icon    |
|----------|---------|----------------|----------------|---------------------------------------|----------------------|
| Client-Side Rendering | CSR | Browser (after JS loads) | Real-time | Dashboards, user-specific content     | N/A (not in build)   |
| Server-Side Rendering | SSR | Per request (server) | Always fresh | Personalized pages, search results    | Lambda (f)           |
| Static Site Generation | SSG | Build time | Stale until rebuild | Blog posts, marketing pages           | Circle               |
| Incremental Static Regeneration | ISR | Build time + revalidation interval | Eventually consistent | Product catalog, news site            | Filled dot           |
| Partial Prerendering | PPR | Mix of build time + request time | Varies | E-commerce, dashboards with static shell | Mixed                |

### CSR (Client-Side Rendering)

Data is fetched in the browser using `useEffect` or a data-fetching library like React Query. The initial HTML is minimal, and the page becomes interactive after JavaScript loads.

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function ClientPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts')
      .then((r) => r.json())
      .then(setPosts);
  }, []);

  return <div>{posts.length} posts loaded</div>;
}
```

### ISR (Incremental Static Regeneration)

Static pages that are revalidated after a configured time interval. The first visitor after `revalidate` seconds triggers a regeneration in the background.

```typescript
// app/products/page.tsx
export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProductsPage() {
  const products = await fetch('https://api.example.com/products').then((r) => r.json());

  return (
    <ul>
      {products.map((p: { id: number; name: string }) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

### PPR (Partial Prerendering)

Combines static and dynamic content within the same page. See the PPR section for a full explanation.

## Choosing the Right Strategy

Use this decision flow when selecting a rendering strategy:

```
Does the content need real-time data?
    |
    +-- YES --> Is the content user-specific?
    |           |
    |           +-- YES --> CSR (for highly interactive) or SSR (for SEO)
    |           |
    |           +-- NO  --> SSR (search, real-time dashboards)
    |
    +-- NO  --> Does the content change frequently?
                |
                +-- YES --> Can we accept stale data for a few minutes?
                |           |
                |           +-- YES --> ISR
                |           |
                |           +-- NO  --> SSR
                |
                +-- NO  --> SSG (perfect for content that rarely changes)
```

## Performance Considerations for SSR

Dynamic rendering has implications at scale:

- **Server load**: Each request requires server processing
- **Database pressure**: Every page render may trigger database queries
- **Latency**: The user must wait for the server to render the page
- **Caching**: SSR responses can be cached with headers like `s-maxage`

To mitigate these issues:

1. **Use React Suspense** to stream dynamic content without blocking the static shell
2. **Implement data caching** with `fetch` cache options or `use cache` directive
3. **Use a CDN** with edge caching for SSR responses (set `Cache-Control` headers)
4. **Batch database queries** to reduce connection overhead
5. **Consider ISR or SSG** for content that does not require real-time freshness

## Summary

- Dynamic rendering (SSR) is triggered by `cookies()`, `headers()`, `searchParams`, and other dynamic APIs
- Dynamic routes show the lambda (f) icon in the build output
- `generateStaticParams` pre-generates specific dynamic routes at build time
- Choose the right strategy: CSR for interactivity, SSR for freshness, SSG for speed, ISR as a middle ground, PPR for hybrid content
- Mitigate SSR performance impact with caching, streaming, and CDN strategies
