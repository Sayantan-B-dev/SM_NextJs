# Streaming

## Overview

Streaming is a server rendering strategy that allows for **progressive UI rendering** from the server. The rendering work is broken into smaller chunks and streamed to the client as soon as they are ready. Users see parts of the page immediately instead of waiting for the entire page to render.

## Streaming vs Suspense SSR

| Aspect | Suspense SSR | Streaming (Next.js App Router) |
|--------|-------------|-------------------------------|
| Architecture | React 18 feature | Built into App Router |
| Setup | Requires manual configuration | Native support via Suspense |
| Chunk delivery | Manual streaming setup | Automatic progressive delivery |
| HTML streaming | Yes | Yes |

## Problem: Blocking Rendering

Consider a product reviews page with components that have slow data fetches:

```tsx
// app/product-reviews/page.tsx
import { Product } from '@/components/Product';
import { Reviews } from '@/components/Reviews';

export default function ProductReviewsPage() {
  return (
    <div>
      <h1>Product Reviews</h1>
      <Product />    {/* Takes 2 seconds */}
      <Reviews />    {/* Takes 4 seconds */}
    </div>
  );
}
```

```tsx
// components/Product.tsx
export async function Product() {
  // Simulate 2-second data fetch
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return <div>Product details</div>;
}
```

```tsx
// components/Reviews.tsx
export async function Reviews() {
  // Simulate 4-second data fetch
  await new Promise((resolve) => setTimeout(resolve, 4000));
  return <div>Reviews content</div>;
}
```

Without streaming, the server waits for all components (6 seconds total) before sending any content to the browser. The user sees nothing during this time.

## Solution: Suspense Boundaries

Wrap slower components with `Suspense` to enable streaming:

```tsx
// app/product-reviews/page.tsx
import { Suspense } from 'react';
import { Product } from '@/components/Product';
import { Reviews } from '@/components/Reviews';

export default function ProductReviewsPage() {
  return (
    <div>
      <h1>Product Reviews</h1>
      <Suspense fallback={<p>Loading product details...</p>}>
        <Product />
      </Suspense>
      <Suspense fallback={<p>Loading reviews...</p>}>
        <Reviews />
      </Suspense>
    </div>
  );
}
```

### Rendering Timeline

| Time | What the User Sees |
|------|-------------------|
| 0s | "Product Reviews" heading |
| 0s | "Loading product details..." |
| 0s | "Loading reviews..." |
| 2s | Product component content replaces loading text |
| 4s | Reviews component content replaces loading text |

## Key Concepts

### Suspense Boundary

A `Suspense` component wraps an async component and provides a `fallback` to show while the component is loading. Each `Suspense` boundary is independent -- other parts of the page continue rendering and streaming.

### Fallback Content

The `fallback` prop accepts any React node (text, loading spinner, skeleton) that displays while the wrapped component is being rendered on the server.

```tsx
<Suspense
  fallback={
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  }
>
  <SlowComponent />
</Suspense>
```

## Benefits of Streaming

- **Faster Time to First Byte (TTFB)**: The server sends content progressively
- **First Paint Sooner**: Users see parts of the page immediately
- **Progressive Enhancement**: Fast components render first, slow ones catch up
- **Better Perceived Performance**: The page feels faster even if total load time is similar
- **No Blocking**: Slow data fetches do not block the entire page

## Summary

| Aspect | Without Streaming | With Streaming |
|--------|------------------|----------------|
| Page delivery | All or nothing | Progressive chunks |
| User experience | Blank screen until complete | Gradual content reveal |
| Time to first content | Total render time | Fastest component time |
| Data dependency | All fetches must complete | Each Suspense boundary independent |
| Implementation | Default behavior | Wrap async components in `<Suspense>` |

Streaming is built into the Next.js App Router and works out of the box with Suspense boundaries, requiring no additional configuration.
