# Production Build

This document covers the production build process in Next.js 15, including build commands, interpreting build output, bundle optimization, and production configuration.

## The Build Command

The production build is triggered by:

```bash
npm run build
```

This command runs `next build` under the hood, which compiles the application into optimized production bundles. During this process, Next.js:

- Compiles all pages and components
- Optimizes images and assets
- Generates static HTML files where possible
- Determines the rendering strategy for each route (static vs dynamic)
- Runs linting if configured

## Understanding Build Output

After running `npm run build`, Next.js prints a summary of all routes and their rendering strategies. Here is an example output:

```
Route (app)                              Size     First Load JS
+  /                                     190 B          85.4 kB
+  /about                                150 B          84.7 kB
+  /blog/[id]                              ?          84.5 kB
+  /api/hello                            180 B          84.3 kB
+  /blog                                   ?            85 kB
+  /posts                                  ?          84.9 kB
+  /posts/[id]                             ?          84.5 kB

+ First Load JS shared by all             84.3 kB
  chunks/framework-123456.js              78.2 kB
  chunks/main-abcdef.js                   6.1 kB
  chunks/webpack-789012.js                512 B
```

### Route Icons Explained

Next.js uses icons to indicate how each route is rendered:

| Icon | Meaning          | Description                                                    |
|------|------------------|----------------------------------------------------------------|
| (circle) | Static           | Route is pre-rendered at build time into static HTML           |
| (filled dot) | Static with revalidation | Route uses ISR with revalidation                              |
| (lambda) f | Dynamic (Server-rendered) | Route is rendered on-demand for each request                    |
| -        | Not generated    | Route is not pre-rendered (e.g., API routes)                   |

### Static Route Example

A route shows the circle icon when it contains no dynamic APIs (no `cookies()`, `headers()`, `searchParams`, etc.) and no dynamic functions. These routes:

- Are rendered to static HTML at build time
- Can be cached on a CDN
- Are extremely fast to serve

### Dynamic Route Example

A route shows the lambda (f) icon when Next.js detects:

- Usage of `cookies()` or `headers()` from `next/headers`
- `searchParams` in page components
- `dynamic = 'force-dynamic'` in route segment config
- `revalidate = 0` or explicit opt-out of caching
- Dynamic functions like `noStore()` from `next/cache`

These routes are rendered per-request on the server.

## Bundle Size Analysis

The build output includes file sizes for each route and the "First Load JS" column. This helps identify large bundles that might impact performance.

To perform deeper analysis, use:

```bash
npm run build -- --analyze
```

Or install `@next/bundle-analyzer`:

```bash
npm install @next/bundle-analyzer
```

Configure in `next.config.ts`:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  swcMinify: true,
};

export default nextConfig;
```

## Optimizing the Bundle

Several techniques help reduce bundle size:

### Code Splitting with Dynamic Imports

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

### Tree Shaking

Import only what you need:

```typescript
// Avoid: import { chunk } from 'lodash';
import chunk from 'lodash/chunk';
```

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/hero.jpg"
  width={1200}
  height={600}
  priority
/>
```

## Production Configuration in next.config.ts

### Compression

Next.js automatically compresses responses with gzip in production. You can customize behavior:

```typescript
const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};
```

### Custom Headers

Set HTTP headers for security and caching:

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};
```

### Redirects

```typescript
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ];
  },
};
```

### Rewrites (proxy-like behavior)

```typescript
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.example.com/:path*',
      },
    ];
  },
};
```

## npm run start vs Development Server

| Aspect              | Dev Server (`next dev`)               | Production (`next start`)              |
|---------------------|---------------------------------------|----------------------------------------|
| Command             | `npm run dev`                         | `npm run build` then `npm run start`   |
| Port                | 3000 (default)                        | 3000 (default)                         |
| Hot Module Replacement | Yes                                | No                                     |
| Bundle Size         | Dev bundles (larger)                  | Production bundles (minified)          |
| Error Overlay       | Yes                                   | No                                     |
| Performance         | Slower (no optimization)              | Fast (fully optimized)                 |
| Environment         | `NODE_ENV=development`                | `NODE_ENV=production`                  |

## Deployment Checklist

Before deploying to production:

1. Run `npm run build` and verify no errors
2. Check the build output for unexpected dynamic routes
3. Review bundle sizes for large pages
4. Set environment variables (`DATABASE_URL`, `AUTH_SECRET`, etc.)
5. Configure proper caching headers for static assets
6. Enable compression and set security headers
7. Use a process manager like PM2 or deploy on Vercel

## Summary

- `npm run build` generates the production build with route analysis
- Circle icons indicate static routes, lambda icons indicate dynamic routes
- Use `next.config.ts` for compression, headers, redirects, and rewrites
- Optimize bundles with dynamic imports, tree shaking, and image optimization
- Run `next start` for the production server, `next dev` for development
