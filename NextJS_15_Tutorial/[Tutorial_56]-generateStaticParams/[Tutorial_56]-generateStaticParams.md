# generateStaticParams

## Overview

`generateStaticParams` is a function that works alongside dynamic route segments to generate static routes during **build time** instead of on demand at request time. This provides performance benefits by pre-rendering pages that would otherwise be dynamically rendered.

## Basic Example

### Folder Structure

```
app/
  products/
    page.tsx              # Product listing page
    [id]/
      page.tsx            # Individual product detail page
```

### Product Listing Page

```tsx
// app/products/page.tsx
import Link from 'next/link';

export default function ProductsPage() {
  return (
    <div>
      <h1>Featured Products</h1>
      <ul>
        <li><Link href="/products/1">Product 1</Link></li>
        <li><Link href="/products/2">Product 2</Link></li>
        <li><Link href="/products/3">Product 3</Link></li>
      </ul>
    </div>
  );
}
```

### Product Detail Page (Without generateStaticParams)

```tsx
// app/products/[id]/page.tsx
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <h1>
      Product {id} details rendered at {new Date().toLocaleTimeString()}
    </h1>
  );
}
```

Without `generateStaticParams`, this dynamic route would be dynamically rendered. The timestamp changes on every refresh.

## Implementing generateStaticParams

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
  return (
    <h1>
      Product {id} details rendered at {new Date().toLocaleTimeString()}
    </h1>
  );
}
```

### Build Output

After adding `generateStaticParams`:

```
.next/server/app/products/
  index.html            # Product listing page
  1.html                # Pre-rendered product 1
  2.html                # Pre-rendered product 2
  3.html                # Pre-rendered product 3
```

The symbol changes from dynamic to a **filled circle** (SSG) in the build output.

### Behavior

- The timestamp stays the same on every refresh (static HTML is served)
- The page loads instantly without server processing
- Pre-rendered at build time, cached, and served to all users

## Using Data Sources

`generateStaticParams` is async, so IDs can be fetched from external sources:

```tsx
export async function generateStaticParams() {
  const products = await fetch('https://api.example.com/products').then((res) =>
    res.json()
  );

  return products.map((product: { id: string }) => ({
    id: product.id,
  }));
}
```

## Multiple Dynamic Segments

For routes with multiple dynamic segments:

```
app/
  products/
    [category]/
      [product]/
        page.tsx
```

```tsx
export async function generateStaticParams() {
  return [
    { category: 'electronics', product: 'smartphone' },
    { category: 'electronics', product: 'laptop' },
    { category: 'books', product: 'science-fiction' },
    { category: 'books', product: 'biography' },
  ];
}
```

Each object includes values for all dynamic segments needed to pre-render the route.

## Use Cases

- Featured products on an e-commerce site
- Popular blog posts
- Top articles or landing pages
- Any subset of dynamic routes that benefits from pre-rendering

## Summary

| Aspect | Without generateStaticParams | With generateStaticParams |
|--------|------------------------------|--------------------------|
| Rendering | Dynamic (per request) | Static (at build time) |
| HTML generation | On demand | At build time |
| Build output | No HTML file | HTML files for each param |
| Performance | Slower (per-request render) | Faster (cached static files) |
| Symbol | Lambda / F | Filled circle (SSG) |
| Data freshness | Always fresh | Frozen at build time |
