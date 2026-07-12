# Caching in Next.js 15

Next.js 15 introduces a refined caching model designed to balance performance with fresh data. Understanding the caching layers is critical for building high-performance applications.

## The Next.js Caching Model

Next.js has multiple caching layers that work together:

| Cache Layer | What It Caches | Scope | Duration |
|---|---|---|---|
| **Full Route Cache** | Rendered HTML and RSC payload | Full page routes | Persistent (build + revalidation) |
| **Data Cache** | Server data (fetch results, database queries) | Per-request, server-side | Configurable (time-based or on-demand) |
| **Fetch Cache** | HTTP fetch responses | Individual fetch calls | Configurable (force-cache, no-store, revalidate) |
| **Router Cache** | React Server Component payloads | Client-side navigation | Session (in-memory) |

## Fetch Caching (Default Behavior)

By default, Next.js caches `fetch` responses. The same URL requested multiple times returns the cached result.

```tsx
// This fetch is cached by default (equivalent to force-cache):
const data = await fetch("https://api.example.com/posts");
```

## Cache Strategies

### `force-cache` (Default)

```ts
const data = await fetch("https://api.example.com/data", {
  cache: "force-cache",
});
```

Caches the response indefinitely until revalidated. Best for static content that rarely changes.

### `no-store`

```ts
const data = await fetch("https://api.example.com/data", {
  cache: "no-store",
});
```

Disables caching entirely. Every request fetches fresh data. Best for real-time or user-specific data.

## Revalidation Strategies

### Time-Based Revalidation

Use `next.revalidate` to set a cache lifetime in seconds. After the specified time, the cache is stale and the next request triggers a background revalidation.

```tsx
const data = await fetch("https://api.example.com/posts", {
  next: { revalidate: 60 }, // Revalidate at most every 60 seconds
});
```

This is known as **stale-while-revalidate**: serve the cached version immediately, then refresh it in the background.

```tsx
// Revalidate every hour
const data = await fetch("https://api.example.com/posts", {
  next: { revalidate: 3600 },
});
```

### On-Demand Revalidation

Use `revalidatePath` or `revalidateTag` to purge caches programmatically, typically after a mutation (POST, PUT, DELETE).

#### `revalidatePath`

Revalidates all cached data for a specific route path.

```ts
// app/actions/submit.ts
"use server";

import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  // Save to database...
  await db.post.create({ title: formData.get("title") });

  // Revalidate the posts list page
  revalidatePath("/posts");
}
```

#### `revalidateTag`

Tag your fetch requests and revalidate by tag name. This allows targeted cache invalidation.

```tsx
// Fetch with a tag:
const data = await fetch("https://api.example.com/posts", {
  next: { tags: ["posts"] },
});
```

```ts
// On-demand revalidation:
import { revalidateTag } from "next/cache";

export async function updatePost() {
  // Update database...
  revalidateTag("posts");
}
```

## `cacheTag` and `cacheLife` (Next.js 15 Experimental)

Next.js 15 introduces the `unstable_cacheTag` and `unstable_cacheLife` APIs for more granular cache control within Server Components.

### `cacheTag`

Attach one or more tags to a cached data fetch or database call:

```ts
import { unstable_cacheTag as cacheTag } from "next/cache";

export default async function PostsPage() {
  "use cache";
  cacheTag("posts");

  const posts = await prisma.post.findMany();
  return ...
}
```

### `cacheLife`

Define a TTL (time-to-live) for cached data:

```ts
import { unstable_cacheLife as cacheLife } from "next/cache";

export default async function PostsPage() {
  "use cache";
  cacheLife("days"); // Can use "seconds", "minutes", "hours", "days", or a number

  const posts = await prisma.post.findMany();
  return ...
}
```

## How Caching Interacts with Rendering

| Rendering Method | Caching Behavior |
|---|---|
| **Static Rendering (default)** | Full Route Cache is enabled. Fetch requests are cached by default. |
| **Dynamic Rendering** | Full Route Cache is disabled. Fetch requests can still be cached. |
| **`force-dynamic`** | Both Full Route Cache and Data Cache are bypassed. |
| **`revalidate` (ISR)** | Full Route Cache uses ISR. Data Cache revalidates on the configured interval. |

### Static Rendering (Default)

```tsx
// Statically rendered at build time. Fetch is cached automatically.
export default async function Page() {
  const data = await fetch("https://api.example.com/data");
  return <div>{data.title}</div>;
}
```

### Dynamic Rendering

```tsx
// Opt into dynamic rendering. Fetch still cached.
export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await fetch("https://api.example.com/data");
  return <div>{data.title}</div>;
}
```

### Incremental Static Regeneration (ISR)

```tsx
// Revalidate the page every 60 seconds
export const revalidate = 60;

export default async function Page() {
  const data = await fetch("https://api.example.com/data");
  return <div>{data.title}</div>;
}
```

## Caching Decision Flow

1. Does the request match a cached Full Route? If yes, serve immediately.
2. Does the `fetch` response exist in the Data Cache? If yes and `revalidate` has not expired, serve cached data.
3. If not cached or stale, fetch fresh data and update the cache.
4. For client-side navigations, the Router Cache serves cached RSC payloads for instant back/forward navigation.

## Best Practices

1. **Use `no-store` for user-specific data** (e.g., profile pages, personalized content).
2. **Use `revalidate` for content that changes predictably** (e.g., blog posts updated every hour).
3. **Use `revalidateTag` / `revalidatePath` for content that changes unpredictably** (e.g., after a form submission).
4. **Avoid mixing `force-dynamic` and caching** -- they work against each other.
5. **Use the experimental `cacheTag` / `cacheLife`** for database query caching (not just fetch).
6. **Default caching behavior favors performance over freshness** -- explicitly opt out when freshness is critical.
7. **Use `loading.tsx` and Suspense** to stream content while waiting for uncached data.
