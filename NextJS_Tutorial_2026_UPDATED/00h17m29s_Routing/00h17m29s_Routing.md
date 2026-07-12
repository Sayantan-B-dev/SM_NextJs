# Routing in Next.js 15

Routing is the backbone of any web application. Next.js 15 uses the **App Router**, a file-system based routing system that maps folders and files directly to URLs.

## File-System Based Routing

In the App Router, every folder inside `app/` represents a route segment, and every `page.tsx` file declares that the route is accessible at that path.

### Basic Mapping

```
app/
  page.tsx              ->  /                    (Home)
  about/
    page.tsx            ->  /about
  blog/
    page.tsx            ->  /blog
  contact/
    page.tsx            ->  /contact
```

The rule is simple: `app/<folder>/page.tsx` becomes `/<folder>` in the URL.

### Why `page.tsx`?

`page.tsx` is the **convention file** for a route's UI. Other conventions include:

| File | Purpose |
|---|---|
| `page.tsx` | Route UI (must be default export) |
| `layout.tsx` | Shared wrapper for a segment and its children |
| `loading.tsx` | Suspense fallback while loading |
| `error.tsx` | Error boundary UI |
| `not-found.tsx` | 404 page for this segment |
| `route.ts` | API endpoint (returns Response, not React) |

## Nested Routes

Folders can be nested to any depth, creating multi-segment URLs:

```
app/
  blog/
    page.tsx              ->  /blog
    [slug]/
      page.tsx            ->  /blog/:slug
    categories/
      technology/
        page.tsx          ->  /blog/categories/technology
```

This structure maps to:

```
/blog                          -> Blog listing
/blog/hello-world              -> Single blog post
/blog/categories/technology    -> Technology category page
```

Each nested page gets its own `page.tsx` file. The **parent layout** wraps all nested pages.

## Dynamic Routes with `[param]`

Folders wrapped in square brackets (`[param]`) create dynamic route segments. The value is passed to the page component via `params`.

### Creating a Dynamic Route

```
app/
  blog/
    [slug]/
      page.tsx
```

### Accessing Params

```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>  // params is a Promise in Next.js 15
}) {
  const { slug } = await params

  return (
    <article>
      <h1>Blog Post: {slug}</h1>
      <p>Viewing post with slug: {slug}</p>
    </article>
  )
}
```

Note: In Next.js 15, `params` is **asynchronous** (wrapped in a Promise). You must `await` it before accessing properties.

### Multiple Dynamic Segments

```tsx
// app/blog/[year]/[month]/[slug]/page.tsx
export default async function DeepBlogPostPage({
  params,
}: {
  params: Promise<{ year: string; month: string; slug: string }>
}) {
  const { year, month, slug } = await params
  return <h1>{year}/{month}/{slug}</h1>
}
```

### Catch-All Routes

Use `[...slug]` for catch-all segments:

```
app/
  docs/
    [...slug]/
      page.tsx
```

```tsx
// app/docs/[...slug]/page.tsx
export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  // slug = ['getting-started', 'installation']
  return <h1>Docs: {slug.join(' / ')}</h1>
}
```

URLs:

```
/docs/getting-started           -> slug: ['getting-started']
/docs/getting-started/install   -> slug: ['getting-started', 'install']
/docs                          -> 404 (no page.tsx at /docs level)
```

For optional catch-all, use `[[...slug]]` which also matches `/docs`.

## Layouts

Layouts wrap pages and persist across navigations. They are defined via `layout.tsx` files.

### Root Layout (`app/layout.tsx`)

The root layout is **required** and wraps all pages:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My App',
  description: 'My Next.js 15 application',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>{/* Global nav */}</nav>
        <main>{children}</main>
        <footer>{/* Global footer */}</footer>
      </body>
    </html>
  )
}
```

### Nested Layouts

You can add `layout.tsx` to any route folder. The layout wraps all pages in that segment and its descendants:

```
app/
  layout.tsx           ->  Wraps ALL pages (root layout)
  blog/
    layout.tsx         ->  Wraps /blog/* pages
    page.tsx           ->  /blog
    [slug]/
      page.tsx         ->  /blog/:slug
```

```tsx
// app/blog/layout.tsx
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <h1>Blog Section</h1>
      <nav>{/* Blog-specific sub-navigation */}</nav>
      {children}
    </section>
  )
}
```

When a user navigates from `/blog` to `/blog/some-post`, only `[slug]/page.tsx` changes. The `blog/layout.tsx` is **not** re-rendered, preserving state and scroll position.

### Layout Nesting Rules

- Layouts can be nested arbitrarily deep
- Parent layouts always wrap child layouts/pages
- Only the root layout can contain `<html>` and `<body>`
- Layouts do **not** have access to `params` from child routes (but can access their own segment's params)

## Route Groups

Route groups allow organizing routes without affecting the URL path. Use parentheses `(groupName)` for folder names:

```
app/
  (marketing)/
    page.tsx              ->  /
    about/
      page.tsx            ->  /about
    blog/
      page.tsx            ->  /blog
  (dashboard)/
    dashboard/
      page.tsx            ->  /dashboard
    settings/
      page.tsx            ->  /settings
```

Both `(marketing)` and `(dashboard)` are URL-neutral. They exist only for organization and can have their own layouts:

```tsx
// app/(marketing)/layout.tsx
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <div className="marketing">{children}</div>
}

// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="dashboard">{children}</div>
}
```

Each group can define its own layout without the group name appearing in the URL.

## Parallel Routes

Parallel routes render multiple pages simultaneously within the same layout, using slots named with `@folder`:

```
app/
  @analytics/
    page.tsx          ->  Renders alongside main page
  @sidebar/
    page.tsx          ->  Renders alongside main page
  layout.tsx          ->  Receives children, @analytics, @sidebar
  page.tsx            ->  Main content
```

```tsx
// app/layout.tsx
export default function Layout({
  children,
  analytics,
  sidebar,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  sidebar: React.ReactNode
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px' }}>
      <div>{children}</div>
      <aside>
        {sidebar}
        {analytics}
      </aside>
    </div>
  )
}
```

Parallel routes are powerful for dashboards, admin panels, and complex layouts where different sections load independently.

## Navigation Between Routes

Use the `Link` component for client-side navigation:

```tsx
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/blog">Blog</Link>
      <Link href={`/blog/${post.slug}`}>Read Post</Link>
    </nav>
  )
}
```

The `Link` component:
- Prefetches linked pages (when in viewport)
- Enables instant client-side navigation
- Supports dynamic `href` values
- Can replace scroll restoration behavior

For programmatic navigation, use `useRouter`:

```tsx
'use client'
import { useRouter } from 'next/navigation'

export default function LoginButton() {
  const router = useRouter()

  return (
    <button onClick={() => router.push('/dashboard')}>
      Go to Dashboard
    </button>
  )
}
```

## Summary

| Concept | Syntax | Example URL |
|---|---|---|
| Static route | `app/about/page.tsx` | `/about` |
| Nested route | `app/blog/page.tsx` | `/blog` |
| Dynamic route | `app/blog/[slug]/page.tsx` | `/blog/hello-world` |
| Catch-all route | `app/docs/[...slug]/page.tsx` | `/docs/a/b/c` |
| Optional catch-all | `app/docs/[[...slug]]/page.tsx` | `/docs` or `/docs/a/b` |
| Route group | `app/(marketing)/page.tsx` | `/` (no group in URL) |
| Parallel route | `app/@feed/page.tsx` | Renders in a slot |
| Layout | `app/layout.tsx` | Wraps children |
| Nested layout | `app/blog/layout.tsx` | Wraps `/blog/*` |

The task project in the `routing-demo/` sibling folder demonstrates all these routing concepts in a runnable Next.js 15 application.
