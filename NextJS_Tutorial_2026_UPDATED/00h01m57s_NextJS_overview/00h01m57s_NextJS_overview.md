# Next.js Overview

## Core Concepts Architecture

Next.js 15 is built around a set of core concepts that work together to deliver a complete application framework. Understanding these concepts and how they relate is essential before diving into code.

```
                  +------------------------------------------+
                  |            Next.js 15 (App Router)        |
                  |                                          |
   +--------------+--------+  +---------+  +---------------+ |
   | Server Components     |  | Client  |  | Route Handlers| |
   | (async, direct DB)    |  | Comp.   |  | (API routes)  | |
   +-----------------------+  +---------+  +---------------+ |
                  |                                          |
   +--------------+--------+  +---------------------------+  |
   | Data Fetching         |  | Caching Layer             |  |
   | (fetch, DB, ORM)      |  | (data cache, full route)  |  |
   +-----------------------+  +---------------------------+  |
                  |                                          |
   +--------------+--------+  +---------------------------+  |
   | Rendering Strategy    |  | Deployment                |  |
   | (SSG, SSR, ISR, PPR)  |  | (Vercel, self-host, etc) |  |
   +-----------------------+  +---------------------------+  |
                  |                                          |
   +--------------+--------+                                 |
   | Proxy (Middleware     |                                 |
   | rewrite/redirect)     |                                 |
   +-----------------------+                                 |
                  +------------------------------------------+
```

## Server Components vs Client Components

This is the most important architectural decision in Next.js 15.

| Aspect | Server Component (Default) | Client Component |
|---|---|---|
| **Declaration** | Any component in the App Router by default | Add `"use client"` directive at top |
| **Rendering** | On the server only | On the client (browser) |
| **Data Fetching** | Direct (async component, `await fetch(...)`) | Via hooks (useEffect, SWR, React Query) |
| **State & Effects** | Not supported (no useState, useEffect) | Fully supported |
| **Bundle Size** | Zero JavaScript sent to browser | Full component code shipped |
| **Access** | Direct DB access, file system, secrets | No direct server access |
| **Use Case** | Data fetching, static content, SEO | Interactivity, event handlers, browser APIs |

### When to Use Each

**Server Components** for:
- Pages and layouts that fetch data
- Static or SEO-sensitive content
- Components that don't need interactivity
- Any data loading (let the server handle it)

**Client Components** for:
- Forms with interactive validation
- Components with `useState`, `useEffect`, `useContext`
- Third-party UI libraries (modals, carousels, date pickers)
- Any code that needs browser APIs (localStorage, geolocation)

## Routing Overview

Next.js 15 uses the **App Router** (introduced in Next.js 13) with a file-system based routing system:

- **`app/` directory**: Top-level container
- **`page.tsx`**: Defines a route's UI (must be default export)
- **`layout.tsx`**: Shared UI wrapper (persists across navigations)
- **`loading.tsx`**: Suspense fallback UI
- **`error.tsx`**: Error boundary UI
- **`not-found.tsx`**: 404 page
- **`route.ts`** or **`route.js`**: API endpoint handler

Example folder-to-URL mapping:

```
app/
  page.tsx          -> / (home)
  about/
    page.tsx        -> /about
  blog/
    page.tsx        -> /blog
    [slug]/
      page.tsx      -> /blog/:slug (dynamic)
  api/
    posts/
      route.ts      -> /api/posts (API endpoint)
```

## Data Fetching Patterns

Next.js 15 provides several patterns for fetching data:

### Server-side (Recommended)

```tsx
// app/posts/page.tsx - Server Component
export default async function PostsPage() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  return (
    <ul>
      {posts.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  )
}
```

### Client-side (with caching)

```tsx
'use client'
import useSWR from 'swr'

export default function PostsPage() {
  const { data, error } = useSWR('/api/posts', fetcher)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
  return <ul>{data.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}
```

### Parallel Data Fetching

```tsx
export default async function DashboardPage() {
  const [user, posts, analytics] = await Promise.all([
    fetch('/api/user').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/analytics').then(r => r.json()),
  ])
  return <Dashboard user={user} posts={posts} analytics={analytics} />
}
```

## Caching Layers

Next.js has a multi-layered caching architecture that has been simplified in the 2026 edition:

1. **Data Cache**: Caches fetch responses across incoming requests. Opt-in via `cache: 'force-cache'` or default.
2. **Full Route Cache**: Caches rendered HTML and RSC payload at build time for static routes.
3. **Router Cache**: Client-side cache that stores RSC payload for instant back/forward navigation.

In the 2026 revamp, you can now explicitly configure caching per fetch:

```tsx
// Default: cache based on render type
fetch('https://api.example.com/data')

// Static rendering (cache indefinitely, like SSG)
fetch('https://api.example.com/data', { cache: 'force-cache' })

// Dynamic rendering (no cache, like SSR)
fetch('https://api.example.com/data', { cache: 'no-store' })

// ISR-style with revalidation
fetch('https://api.example.com/data', { next: { revalidate: 60 } })
```

## Rendering Strategies

| Strategy | Full Name | Cache Behavior | Use Case | Freshness |
|---|---|---|---|---|
| **SSG** | Static Site Generation | Built once, served from CDN | Marketing pages, blog posts, docs | Stale (rebuild to update) |
| **SSR** | Server-Side Rendering | Rendered per request (no cache) | Dashboards, user-specific data | Always fresh |
| **ISR** | Incremental Static Regeneration | Cached, revalidated on demand | E-commerce, news sites | Configurable (time/tag) |
| **PPR** | Partial Prerendering | Static shell + dynamic holes | Hybrid pages (static + dynamic) | Per-section control |

### Choosing the Right Strategy

```tsx
// SSG (default for fetch without cache: 'no-store')
export default async function StaticPage() {
  const data = await fetch('https://api.example.com/data', { cache: 'force-cache' })
  // ...
}

// SSR
export default async function DynamicPage() {
  const data = await fetch('https://api.example.com/data', { cache: 'no-store' })
  // ...
}

// ISR
export default async function IsrPage() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 }  // revalidate every hour
  })
  // ...
}

// PPR (requires next.config.ts: experimental: { ppr: true })
// - Static shell renders immediately
// - Dynamic holes use Suspense boundaries with fallbacks
```

## Deployment Options

| Platform | Features | Cost |
|---|---|---|
| **Vercel** | Native Next.js support, Edge Functions, Analytics, ISR | Free tier + paid plans |
| **Netlify** | Serverless functions, On-demand builders | Free tier + paid plans |
| **Docker** | Self-hosted, full control | Infrastructure cost |
| **Node.js Server** | Custom server, any hosting (AWS, GCP, Azure) | Infrastructure cost |
| **Static Export** | `next export`, deploy to S3, Cloudflare Pages, etc. | Lowest cost |

For production, Vercel is the recommended platform as it provides the most seamless integration with all Next.js features (ISR, PPR, Edge Middleware/Proxy, Analytics).

## Summary

- **Server Components** are the default and should be your first choice
- **Client Components** are only needed for interactivity and browser APIs
- **File-based routing** with the App Router is the standard
- **Multiple rendering strategies** let you optimize for speed vs. freshness
- **Caching is now opt-in and explicit**, making it more predictable
- **Deploy anywhere**, but Vercel gives you the full feature set
