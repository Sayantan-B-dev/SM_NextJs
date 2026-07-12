# Introduction & Why Next.js

## What is Next.js?

Next.js is a **React framework** for building production-grade web applications. It extends React with powerful features such as server-side rendering (SSR), static site generation (SSG), incremental static regeneration (ISR), file-based routing, API routes, and built-in optimizations for images, fonts, and scripts.

Created and maintained by Vercel, Next.js enables developers to build full-stack React applications with minimal configuration while maintaining excellent developer experience (DX) and performance.

## Why Next.js?

| Reason | Description |
|--------|-------------|
| **SEO Benefits** | SSR and SSG deliver fully rendered HTML to search engines, improving crawlability and indexing. |
| **Faster Initial Page Loads** | Pre-rendered HTML is served immediately; JavaScript hydration adds interactivity afterward. |
| **Automatic Code Splitting** | Each page only loads the JavaScript it needs, reducing bundle size. |
| **Built-in Image Optimization** | The `next/image` component automatically optimizes images (lazy loading, WebP, resizing). |
| **File-Based Routing** | No need for a router configuration; the file system determines routes. |
| **API Routes** | Build backend endpoints inside the same project (serverless functions). |
| **TypeScript Support** | First-class TypeScript integration with zero configuration. |
| **Large Ecosystem** | Thousands of plugins, examples, and a massive community. |
| **Hybrid Rendering** | Use SSR, SSG, ISR, or client-side rendering on a per-page basis. |
| **Edge Runtime** | Deploy globally with Vercel Edge Functions for low-latency responses. |

## Underlying Technologies

Next.js is built on top of these core technologies:

- **React** -- The UI library for building component-based interfaces.
- **Node.js** -- Server runtime for pre-rendering and API routes.
- **Webpack / Turbopack** -- Bundler and dev server. Turbopack is the default in Next.js 15 for faster local development.
- **TypeScript** -- Optional but recommended static type checking.
- **Vercel** -- Deployment platform with global CDN, serverless functions, and Edge Network.

It works with any hosting provider (AWS, Docker, self-hosted, Netlify, etc.), not just Vercel.

## Core Features / Building Blocks

### Server-Side Rendering (SSR)

Pages are rendered on the server **on each request**. The user receives fully rendered HTML, which is then hydrated on the client.

```tsx
// app/profile/page.tsx
export default async function ProfilePage() {
  const data = await fetch("https://api.example.com/profile");
  const profile = await data.json();

  return (
    <div>
      <h1>{profile.name}</h1>
      <p>{profile.bio}</p>
    </div>
  );
}
```

### Static Site Generation (SSG)

Pages are rendered at **build time** into static HTML. These pages are fast and can be cached on a CDN.

```tsx
// app/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>This page is generated at build time.</p>
    </div>
  );
}
```

### Incremental Static Regeneration (ISR)

Combines SSG with periodic revalidation. Pages are statically generated first, then re-rendered in the background after a specified time.

```tsx
// app/products/page.tsx
export default async function ProductsPage() {
  const res = await fetch("https://api.example.com/products", {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });
  const products = await res.json();

  return (
    <ul>
      {products.map((p: { id: number; name: string }) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

### File-Based Routing (App Router)

The `app/` directory uses a file-system router. Folders define route segments; special files define the UI.

| File | Purpose |
|------|---------|
| `page.tsx` | Route UI (must be exported as default) |
| `layout.tsx` | Shared layout wrapping child pages |
| `loading.tsx` | Loading UI (shown during streaming) |
| `error.tsx` | Error boundary UI |
| `not-found.tsx` | 404 page |

```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <article>Blog post: {slug}</article>;
}
```

### API Routes

Create backend endpoints inside the same project using route handlers.

```tsx
// app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: "Hello, world!" });
}
```

### Built-in Image Optimization

```tsx
import Image from "next/image";

export default function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={1200}
      height={600}
      priority
    />
  );
}
```

### Middleware

Execute code before a request completes. Useful for redirects, rewrites, authentication, etc.

```tsx
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/old-path") {
    return NextResponse.redirect(new URL("/new-path", request.url));
  }
}

export const config = {
  matcher: "/old-path",
};
```

### Edge Runtime

Run serverless functions at the Edge for minimal latency. Supported in route handlers and middleware.

## How Next.js Works

Next.js uses a **pre-rendering** approach. By default, every page is pre-rendered into HTML before being sent to the client.

### Rendering Flow

1. **Build / Request Time** -- Next.js pre-renders each page (SSG at build time, SSR on each request).
2. **HTML Delivery** -- The fully rendered HTML is sent to the browser.
3. **Hydration** -- React's JavaScript bundle loads and attaches event handlers, making the page interactive.

This process is called **hydration**. The HTML is already visible to the user while JavaScript loads in the background.

```
Client Request
       |
       v
Next.js Server (pre-renders page)
       |
       v
Full HTML delivered to browser (visible immediately)
       |
       v
React hydrates (JavaScript loads, interactivity enabled)
```

## Key Rules & Conventions

### File-based Routing

- The `app/` directory defines routes based on folder structure.
- `page.tsx` is required for each route segment to be publicly accessible.
- Route parameters are defined with `[param]` folder names and accessed via `params`.

### Server and Client Components

- **Server Components** (default) -- Render on the server, cannot use hooks or browser APIs. Reduces client-side JavaScript.
- **Client Components** -- Use `"use client"` directive at the top of the file. Can use hooks, event handlers, and browser APIs.

```tsx
// Server component (default)
export default function ServerComponent() {
  return <p>Rendered on the server.</p>;
}

// Client component
"use client";
import { useState } from "react";

export default function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Special File Names

These files in the `app/` directory have reserved meanings:

| File | Purpose |
|------|---------|
| `page.tsx` | Page content for a route |
| `layout.tsx` | Persistent layout wrapping all child pages |
| `template.tsx` | Layout that remounts on navigation |
| `loading.tsx` | UI shown during streaming/server rendering |
| `error.tsx` | Error boundary UI |
| `not-found.tsx` | Custom 404 page |
| `route.tsx` | API route handler |

## The Big Picture

Next.js is a **full-stack framework** for React. It eliminates the need for a separate backend for many applications by providing:

- **Frontend** -- React components, routing, layouts, styling, image optimization.
- **Backend** -- API routes, middleware, server functions, and database connections.
- **Deployment** -- Optimized builds, serverless functions, CDN distribution.

The philosophy behind Next.js is to provide an **opinionated but flexible** framework that handles the hard parts of building web applications (code splitting, bundling, routing, rendering strategy) so developers can focus on building features.

### Typical Project Structure

```
my-app/
  app/
    layout.tsx       # Root layout
    page.tsx         # Home page
    about/
      page.tsx       # /about route
    api/
      hello/
        route.tsx    # /api/hello endpoint
    blog/
      [slug]/
        page.tsx     # /blog/:slug route
  public/
    assets/          # Static files
  next.config.ts     # Next.js configuration
  package.json       # Dependencies and scripts
  tsconfig.json      # TypeScript configuration
```

### When to Use Next.js

- **Marketing sites and blogs** -- SSG for static pages, ISR for dynamic content.
- **E-commerce** -- SSR for product pages (SEO-critical), client-side rendering for dashboards.
- **SaaS applications** -- SSR for public pages, client components for authenticated areas.
- **Full-stack applications** -- API routes + frontend in a single codebase.

Next.js is not ideal for purely static SPAs where React alone suffices, or for projects requiring complete control over the bundler configuration.
