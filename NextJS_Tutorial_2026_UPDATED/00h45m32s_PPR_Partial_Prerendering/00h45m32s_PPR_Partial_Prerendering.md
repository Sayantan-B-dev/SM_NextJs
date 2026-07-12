# PPR - Partial Prerendering

Partial Prerendering (PPR) is an experimental rendering model in Next.js that combines statically prerendered content with dynamically streamed content within a single page. It creates a "static shell" with "dynamic holes."

## Overview

PPR allows you to serve a static HTML shell immediately while streaming dynamic content as it becomes available. This is different from:

- **Full SSG**: The entire page is static, no dynamic content
- **Full SSR**: The entire page is rendered per request
- **Suspense streaming**: Dynamic parts stream in, but the page itself may still be dynamic

With PPR, the page shell (nav, footer, layout) is statically prerendered, while dynamic parts (user profile, recommendations, cart) are streamed in.

## Enabling PPR

PPR is an experimental feature in Next.js 15 and must be enabled in `next.config.ts`:

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
  },
};

export default nextConfig;
```

You can also enable PPR for specific route segments:

```typescript
// app/segment/page.tsx
export const experimental_ppr = true;
```

## How PPR Works

1. **Static Shell**: Next.js prerenders the static parts of the page at build time (layout, navigation, footer, static content)
2. **Dynamic Holes**: Components wrapped in `Suspense` are marked as dynamic and streamed to the client at request time
3. **Instant Initial Render**: The static shell is served from the CDN immediately
4. **Progressive Enhancement**: Dynamic content streams in as it becomes available

### Visual Representation

```
+------------------------------------------+
|           NAVBAR (static)                 |  <-- prerendered at build
+------------------------------------------+
|  PRODUCT IMAGE (static or revalidated)   |  <-- prerendered or ISR
+------------------------------------------+
|  PRODUCT INFO (static)                    |  <-- prerendered at build
+------------------------------------------+
|  RECOMMENDATIONS (dynamic)                |  <-- streamed per request
|  (Suspense boundary)                      |
+------------------------------------------+
|           FOOTER (static)                 |  <-- prerendered at build
+------------------------------------------+
```

## E-Commerce Product Page Example

This is the ideal use case for PPR -- an e-commerce product page with mostly static content but dynamic recommendations.

### Layout (Static Shell)

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/cart">Cart</a>
        </nav>
        <main>{children}</main>
        <footer>
          <p>Copyright 2026</p>
        </footer>
      </body>
    </html>
  );
}
```

### Product Page with PPR

```typescript
// app/products/[id]/page.tsx
import { Suspense } from 'react';
import ProductInfo from '@/components/ProductInfo';
import ProductImage from '@/components/ProductImage';
import Recommendations from '@/components/Recommendations';
import CartButton from '@/components/CartButton';

export const experimental_ppr = true;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="product-page">
      <div className="product-layout">
        <Suspense fallback={<div>Loading image...</div>}>
          <ProductImage productId={id} />
        </Suspense>

        <Suspense fallback={<div>Loading product info...</div>}>
          <ProductInfo productId={id} />
        </Suspense>
      </div>

      <Suspense fallback={<div>Loading recommendations...</div>}>
        <Recommendations productId={id} />
      </Suspense>

      <Suspense fallback={<div>Loading cart...</div>}>
        <CartButton productId={id} />
      </Suspense>
    </div>
  );
}
```

### Components

```typescript
// components/ProductImage.tsx
export default async function ProductImage({
  productId,
}: {
  productId: string;
}) {
  // This could be static (cache) or revalidate with ISR
  const product = await fetch(`https://api.example.com/products/${productId}`)
    .then((r) => r.json());

  return <img src={product.image} alt={product.name} />;
}

// components/Recommendations.tsx
export default async function Recommendations({
  productId,
}: {
  productId: string;
}) {
  // Simulate a slow, dynamic fetch
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const recommendations = await fetch(
    `https://api.example.com/products/${productId}/recommendations`,
    { cache: 'no-store' }
  ).then((r) => r.json());

  return (
    <div className="recommendations">
      <h2>You might also like</h2>
      <ul>
        {recommendations.map((r: { id: number; name: string }) => (
          <li key={r.id}>{r.name}</li>
        ))}
      </ul>
    </div>
  );
}

// components/CartButton.tsx
import { cookies } from 'next/headers';

export default async function CartButton({
  productId,
}: {
  productId: string;
}) {
  const cookieStore = await cookies();
  const cartItems = cookieStore.get('cart')?.value ?? '[]';
  const inCart = JSON.parse(cartItems).includes(productId);

  return (
    <button className={inCart ? 'in-cart' : 'add-to-cart'}>
      {inCart ? 'In Cart' : 'Add to Cart'}
    </button>
  );
}
```

## Simulating Delays for Testing

When testing PPR, you can simulate slow data fetching with artificial delays:

```typescript
// Simulating a slow API call
async function getSlowData() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return fetch('https://api.example.com/data').then((r) => r.json());
}
```

This helps verify that the static shell renders immediately while the delayed content streams in.

## PPR vs Other Strategies

| Aspect                | Full SSG                | Full SSR                | Suspense + SSR          | PPR                          |
|-----------------------|-------------------------|-------------------------|-------------------------|------------------------------|
| Initial HTML          | All static              | None (wait for render)  | Static shell only       | Static shell                 |
| Dynamic content       | Not supported           | Rendered per request    | Streamed after fetch    | Streamed after fetch         |
| CDN caching           | Entire page             | Not cacheable           | Shell cacheable         | Shell cacheable              |
| Time to First Byte    | Instant (CDN)           | Server render time      | Instant (shell only)    | Instant (shell only)         |
| Use case              | Blog, docs              | Dashboard, search       | Any with streaming      | E-commerce, content sites    |
| Build output          | All static (circle)     | All dynamic (lambda)    | Mixed (depends on page) | Mixed (static + dynamic)     |

## Best Practices for PPR

1. **Identify static vs dynamic parts**: Analyze which parts of your page can be prerendered and which need to be dynamic
2. **Use Suspense boundaries**: Wrap dynamic components in Suspense with meaningful fallbacks
3. **Avoid dynamic APIs in layouts**: Keep layouts purely static for maximum caching benefit
4. **Set appropriate cache headers**: Static shells can be cached aggressively on CDNs
5. **Test with artificial delays**: Verify that the static shell renders instantly by adding `setTimeout` to dynamic components

## Limitations

- PPR is experimental and may change
- Not all third-party libraries are compatible
- Dynamic content inside Suspense boundaries cannot be cached on the CDN
- Requires careful component architecture to maximize the static shell

## Summary

- PPR combines a static prerendered shell with dynamically streamed content
- Enable with `experimental: { ppr: true }` in `next.config.ts`
- Dynamic components must be wrapped in `Suspense` boundaries
- Ideal for e-commerce, content sites, and dashboards
- Provides instant initial load with progressive content streaming
- More sophisticated than basic Suspense streaming because the entire shell is prerendered at build time
