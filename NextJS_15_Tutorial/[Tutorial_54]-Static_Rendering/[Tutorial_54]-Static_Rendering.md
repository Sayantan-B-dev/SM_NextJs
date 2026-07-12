# Static Rendering

## Overview

Static rendering is a server rendering strategy where HTML pages are generated at **build time** rather than at request time. The pre-rendered pages can be cached by CDNs and served instantly to users. The same pre-rendered page can be shared among different users, providing significant performance benefits.

## When to Use Static Rendering

- Blog posts
- E-commerce product listings
- Documentation pages
- Marketing pages

## Default Behavior

Static rendering is the **default strategy** in the App Router. All routes are automatically pre-rendered at build time without any additional setup.

## Development vs Production

| Environment | Behavior |
|-------------|----------|
| Development | Pages are pre-rendered on every request to reflect code changes immediately |
| Production | Pages are pre-rendered once during the build process |

## Build Output Analysis

Run the production build:

```bash
npm run build
```

### Route Table Columns

| Column | Description |
|--------|-------------|
| Route | The route path |
| Size | Data downloaded when navigating client-side to that page |
| First Load JS | Total JavaScript downloaded when initially loading from the server |

### Components Breakdown

| Bundle Component | Size |
|-----------------|------|
| Shared bundle (CSS, runtime, framework, vendor) | ~105 KB |
| Root page (`/`) | ~8.4 KB |
| Server component page | ~136 bytes (client nav) |
| Client component page | ~370 bytes (client nav) |

### Route Symbols

| Symbol | Meaning |
|--------|---------|
| Hollow circle | Static rendering (pre-rendered at build time) |
| Filled circle | SSG with `generateStaticParams` |
| Lambda / F | Dynamic rendering |

## Build Output Files

After building, the `.next` folder contains:

### Server Folder (`next/server/app/`)

```
.next/
  server/
    app/
      index.html        # Root page
      about.html        # About page (server component)
      dashboard.html    # Dashboard page (client component)
      not-found.html    # 404 page
      about.rsc         # RSC payload for about page
      dashboard.rsc     # RSC payload for dashboard page
```

**HTML files** contain the pre-rendered markup. Even client components get pre-rendered HTML as an optimization step.

**RSC payloads** (`.rsc` files) represent the virtual DOM in a compact JSON format:
- For server components: includes the actual rendered result (e.g., `<h1>About page</h1>`)
- For client components: contains placeholders showing where client components should go, plus references to their JavaScript files

### Static Folder (`next/static/chunks/app/`)

```
.next/
  static/
    chunks/
      app/
        dashboard/
          page-[hash].js  # Client component code
```

This folder contains the JavaScript chunks needed for client-side hydration and reconciliation.

## Serving the Production Build

```bash
npm run start
```

### Initial Load

When visiting a page directly or performing a hard reload:
- The server sends the **HTML document** (e.g., `index.html`, `about.html`)
- The client also receives RSC payloads and JavaScript chunks for hydration
- The server sends resources for **all prefetched routes** during the initial load

### Client-Side Navigation

When navigating via Link components:
- Pages render instantly without hitting the server
- All required resources were prefetched and cached during the initial page load

## Prefetching

Next.js automatically prefetches static routes as their links become visible in the viewport. For static routes, Next.js prefetches and caches the **entire route**, enabling instant client-side navigation.

## Timestamp Example

```tsx
// app/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>About page</h1>
      <p>{new Date().toLocaleTimeString()}</p>
    </div>
  );
}
```

In a static route, the timestamp is frozen at build time. It remains the same across refreshes and users until the application is rebuilt.

## Summary

- Static rendering generates HTML at build time
- RSC payloads for components and JavaScript chunks for client-side hydration are created during build
- Direct route visits serve HTML files
- Client-side navigation uses RSC payloads and JavaScript chunks without additional server requests
- Prefetching automatically loads static routes for instant navigation
- Static rendering is excellent for blogs, documentation, and marketing pages
