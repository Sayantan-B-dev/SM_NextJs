# Handling Errors in Nested Routes

## Overview

In Next.js, errors bubble up through the route hierarchy until they find the nearest parent error boundary. Understanding this behavior is crucial for placing `error.tsx` files at the right level to achieve the desired granularity of error handling.

## Route Hierarchy and Error Propagation

Consider the following route structure:

```
app/
  products/
    layout.tsx
    error.tsx
    [productId]/
      layout.tsx
      page.tsx
      reviews/
        [reviewId]/
          page.tsx
          error.tsx
```

When an error occurs in `app/products/[productId]/reviews/[reviewId]/page.tsx`, it bubbles up in the following order:

1. `error.tsx` in the same folder (`reviews/[reviewId]/`)
2. `error.tsx` in parent segment (`products/`)
3. Root error boundary or `global-error.tsx`

## Error Placement: Granular vs Broad

### Placing error.tsx at the Deepest Level

When `error.tsx` is placed adjacent to the throwing page:

```
products/[productId]/reviews/[reviewId]/
  error.tsx  (catches errors from review pages)
  page.tsx
```

Only the review ID component is replaced by the error UI. The surrounding layout (e.g., the featured product section from `productId/layout.tsx`) remains intact.

```tsx
// app/products/[productId]/reviews/[reviewId]/error.tsx
"use client";

export default function ReviewError({
  error,
}: {
  error: Error;
}) {
  return (
    <div>
      <h2>Error loading review</h2>
      <p>{error.message}</p>
    </div>
  );
}
```

### Placing error.tsx at a Higher Level

When `error.tsx` is moved to a parent segment:

```
products/
  error.tsx  (catches errors from all nested routes under products/)
  [productId]/
    reviews/
      [reviewId]/
        page.tsx
```

The error from the review page bubbles up past the `reviewId` folder (no error boundary there) and is caught by `products/error.tsx`. This replaces the entire products route content, including the product ID layout and any UI elements.

```tsx
// app/products/error.tsx
"use client";

export default function ProductsError({
  error,
}: {
  error: Error;
}) {
  return (
    <div>
      <h2>Something went wrong in Products</h2>
      <p>{error.message}</p>
    </div>
  );
}
```

## Visual Comparison

| Error Boundary Location | Error Occurs In | What Gets Replaced |
|------------------------|-----------------|-------------------|
| `reviews/[reviewId]/error.tsx` | `reviews/[reviewId]/page.tsx` | Only the review component |
| `products/error.tsx` | `reviews/[reviewId]/page.tsx` | Entire products route (layout + all children) |
| `products/error.tsx` | `products/[productId]/page.tsx` | Entire products route |

## Example: Multiple Error Boundaries at Different Levels

For fine-grained error handling, place error boundaries at multiple levels:

```
app/
  products/
    error.tsx              -- catches errors in all products sub-routes
    [productId]/
      page.tsx
      error.tsx            -- catches errors specific to a single product
      reviews/
        [reviewId]/
          page.tsx
          error.tsx        -- catches errors specific to a single review
```

```tsx
// app/products/error.tsx -- broad, catches anything under products
"use client";

export default function ProductsError({ error }: { error: Error }) {
  return <div>Products section error: {error.message}</div>;
}
```

```tsx
// app/products/[productId]/error.tsx -- specific to product details
"use client";

export default function ProductError({ error }: { error: Error }) {
  return <div>Product error: {error.message}</div>;
}
```

```tsx
// app/products/[productId]/reviews/[reviewId]/error.tsx -- specific to reviews
"use client";

export default function ReviewError({ error }: { error: Error }) {
  return <div>Review error: {error.message}</div>;
}
```

## Error Boundary Hierarchy Rules

1. An error boundary catches errors in its own segment and all **nested child segments**
2. Errors bubble UP to the nearest parent error boundary if the current segment has none
3. Once an error is caught, the error boundary UI replaces the content of that segment and all its children
4. Multiple error boundaries at different levels provide increasingly granular fallback UIs

## Key Points

- Errors always bubble up to find the closest parent error boundary
- Placing `error.tsx` closer to the potential error source limits the scope of UI disruption
- Placing `error.tsx` at a higher level provides a catch-all for multiple sub-routes
- Use multiple error boundaries at different levels for precise error containment
- The layout at the same level as the error boundary remains intact
- Layouts at higher levels (above the error boundary) also remain unaffected
