# Deploying Next.js

Next.js applications can be deployed to a variety of platforms. This guide covers the most common deployment targets: Vercel, Netlify, Docker (self-hosted), and static export. It also covers environment variable management, build configuration, and optimization tips.

---

## 1. Vercel Deployment

Vercel is the native hosting platform for Next.js, created by the same company. It provides the best integration and feature support.

### Step-by-Step

1. **Push your project to GitHub, GitLab, or Bitbucket.**
2. **Go to [vercel.com](https://vercel.com) and click "Add New" > "Project".**
3. **Import your repository.**
4. **Configure build settings** (Vercel auto-detects Next.js):
   - Framework preset: Next.js
   - Build command: `next build` (default)
   - Output directory: `.next` (default)
   - Install command: `npm install` (default)
5. **Set environment variables** in the Vercel dashboard under Settings > Environment Variables.
6. **Deploy.** Every push to the main branch triggers a production deployment.

### Environment Variables on Vercel

| Variable Type | Available In | Example |
|---|---|---|
| Production | Production deployments only | `DATABASE_URL` |
| Preview | Preview/pre-production deployments | `DATABASE_URL_PREVIEW` |
| Development | Local `vercel dev` | `DATABASE_URL_DEV` |

### Custom Domains

- Add your domain in Vercel dashboard under Project > Domains.
- Vercel automatically provisions SSL certificates (TLS) via Let's Encrypt.
- Configure DNS: add a CNAME record pointing to `cname.vercel-dns.com`.

### Serverless Functions

- Route Handlers (`route.ts`) and API Routes are deployed as **serverless functions**.
- Default timeout: 10 seconds (configurable up to 900s on Pro).
- Maximum function size: 50 MB (uncompressed), 250 MB (compressed).

---

## 2. Netlify Deployment

Netlify also supports Next.js via the `@netlify/plugin-nextjs` plugin.

### Setup

1. Push to GitHub/GitLab.
2. Go to [app.netlify.com](https://app.netlify.com) and import your repository.
3. Set framework to Next.js.
4. Build settings auto-populate:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Deploy.

Alternatively, use `next-on-netlify` for more control:

```bash
npm install -D @netlify/plugin-nextjs
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"
```

### Limitations on Netlify

- Middleware may not work identically to Vercel.
- ISR has different behavior; on-demand revalidation requires configuration.
- Consider Netlify's Edge Functions for middleware-like behavior.

---

## 3. Docker Deployment (Self-Hosted)

Docker gives you full control over the environment. Use the `standalone` output for minimal image size.

### next.config.ts

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
};

export default nextConfig;
```

The `standalone` output creates an optimized build in `.next/standalone/` that includes only the necessary files, plus a minimal `server.js`.

### Dockerfile

```dockerfile
# Stage 1: Dependencies and Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

### Build and Run

```bash
docker build -t my-nextjs-app .
docker run -p 3000:3000 my-nextjs-app
```

### Docker Compose (with Database)

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/myapp
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: myapp
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---

## 4. Static Export

For fully static sites (no server required), use the static export feature.

### Configuration

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
};
```

### Build

```bash
npm run build
```

This outputs a static site to the `out/` directory, which you can serve with any static file server (Nginx, Apache, S3, Cloudflare Pages, etc.).

### Limitations

- No server-side features (Route Handlers, Server Actions, middleware, ISR).
- Image optimization with `next/image` requires a custom loader or `unoptimized` prop.
- Dynamic routes require `generateStaticParams` to pre-render all paths.

```typescript
// app/posts/[id]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllPostIds();
  return posts.map((id) => ({ id }));
}
```

---

## 5. Environment Variables

### Public vs Secret Variables

| Prefix | Scope | Example |
|---|---|---|
| `NEXT_PUBLIC_` | Available on client and server | `NEXT_PUBLIC_SITE_URL` |
| No prefix | Server-side only (inlined at build time) | `DATABASE_URL`, `API_SECRET` |
| Runtime | Available on server at runtime | Set in hosting dashboard |

### .env File Convention

| File | Purpose |
|---|---|
| `.env.local` | Local development (ignored by git) |
| `.env` | Default values (committed to git) |
| `.env.production` | Production overrides |
| `.env.example` | Documentation of required variables (committed) |

### Example .env.example

```env
# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Database
DATABASE_URL=postgres://user:pass@localhost:5432/myapp

# Authentication
AUTH_SECRET=your-secret-key
AUTH_GITHUB_ID=github-client-id
AUTH_GITHUB_SECRET=github-client-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 6. Build Optimization Checklist

| Optimization | Action |
|---|---|
| **Use `standalone` output** | `output: 'standalone'` in next.config.ts -- smaller Docker images |
| **Enable Turbopack dev** | Already default in Next.js 15 |
| **Optimize images** | Use `next/image` with a proper loader |
| **Lazy load** | Use `next/dynamic` for heavy components |
| **Bundle analysis** | Run `ANALYZE=true npm run build` with `@next/bundle-analyzer` |
| **Tree-shake** | Import only what you need from libraries |
| **Fonts** | Use `next/font` for optimized self-hosted fonts |
| **Static where possible** | Use `force-static` or ISR for pages that don't need dynamic data |
| **Minify** | Done automatically in production builds |
| **Compression** | Vercel and Nginx gzip/brotli compress responses |
| **CDN** | Use Vercel Edge Network, Cloudflare, or similar |
| **Logging** | Remove `console.log` in production (use a proper logger) |

### Checking Build Output

```bash
npm run build
```

Look for:

- **Route (app)** size -- large pages may need code splitting.
- **First Load JS** -- aim for under 100 KB for critical pages.
- **Static vs Dynamic** -- ensure pages are rendered as expected.

---

## 7. Deployment Checklist

Before deploying to production:

- [ ] Environment variables are set on the hosting platform.
- [ ] Database migrations have been run.
- [ ] Build succeeds locally (`npm run build`).
- [ ] TypeScript passes (`npm run typecheck` or `tsc --noEmit`).
- [ ] Linting passes (`npm run lint`).
- [ ] Tests pass (unit, integration, e2e).
- [ ] SSL certificate is provisioned (auto on Vercel).
- [ ] Custom domain DNS is configured.
- [ ] Analytics and monitoring are set up.
- [ ] Error tracking (Sentry, etc.) is configured.
- [ ] Rate limiting is applied to public APIs.

---

## 8. Summary

- **Vercel** provides the easiest and most feature-complete deployment.
- **Netlify** is a viable alternative with some limitations.
- **Docker** with `standalone` output is ideal for self-hosting.
- **Static export** works for purely static sites with no server requirements.
- Use `NEXT_PUBLIC_` prefix for client-side environment variables.
- Always run a production build locally before deploying.
- Optimize bundles, images, and fonts for fast load times.
