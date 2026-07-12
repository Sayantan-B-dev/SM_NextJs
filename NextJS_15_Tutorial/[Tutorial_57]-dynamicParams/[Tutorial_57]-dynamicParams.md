# dynamicParams

## Overview

`dynamicParams` controls how Next.js handles requests for dynamic segments that were **not included** in `generateStaticParams`. It determines whether unlisted param values are rendered on demand or return a 404.

## Default Behavior

`dynamicParams` defaults to `true`, meaning Next.js will statically render pages for dynamic segments that were not pre-rendered via `generateStaticParams`.

## dynamicParams: true (Default)

```tsx
// app/products/[id]/page.tsx
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <h1>Product {id}</h1>;
}
```

With `dynamicParams: true` (default):
- `/products/1`, `/products/2`, `/products/3` are pre-rendered at build time
- `/products/4`, `/products/5`, etc. are **statically rendered on first request** (at runtime)
- After first visit, the generated HTML file is stored in the build output

### Build Output After Visiting /products/4

```
.next/server/app/products/
  1.html        # Pre-rendered at build time
  2.html        # Pre-rendered at build time
  3.html        # Pre-rendered at build time
  4.html        # Generated at runtime after first visit
```

The timestamp for `/products/4` stays the same on subsequent refreshes because it becomes statically rendered at runtime.

## dynamicParams: false

```tsx
// app/products/[id]/page.tsx
export const dynamicParams = false;

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <h1>Product {id}</h1>;
}
```

With `dynamicParams: false`:
- Only `/products/1`, `/products/2`, `/products/3` are accessible
- `/products/4` and any other ID returns a **404 page**

## Use Cases

| Scenario | Recommended dynamicParams | Reason |
|----------|--------------------------|--------|
| E-commerce site with many products | `true` | Pre-render popular products, allow access to all others |
| Blog with fixed set of posts | `false` | Pre-render all posts, 404 for non-existent slugs |
| Marketing site with limited pages | `false` | Strict control over accessible routes |
| User-generated content | `true` | Dynamic content with growing dataset |

## Summary

| Setting | Behavior for Unlisted Params | When to Use |
|---------|------------------------------|-------------|
| `true` (default) | Statically rendered on demand | Large datasets, many dynamic routes |
| `false` | Returns 404 | Fixed datasets, strict route control |
