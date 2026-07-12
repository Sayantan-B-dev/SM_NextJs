# Handling Errors in Layouts

## Overview

There is an important nuance when handling errors in layouts: `error.tsx` **cannot** catch errors thrown by the `layout.tsx` file in the **same** segment. This is due to the component hierarchy -- the layout component sits above the error boundary in the React tree.

To catch errors in a layout, the error boundary must be placed in the **parent** segment.

## Understanding the Component Hierarchy

For a route segment like `products/[productId]`:

```
<RootLayout>
  <ProductsLayout>
    <ProductIdLayout>        <-- Error thrown here
      <ErrorBoundary>        <-- Cannot catch layout errors in same segment
        <Page />
      </ErrorBoundary>
    </ProductIdLayout>
  </ProductsLayout>
</RootLayout>
```

The error boundary (`error.tsx`) is rendered **inside** the layout of the same segment. If the layout itself throws an error, the error boundary never gets a chance to mount.

## Problem: Error in Same-Segment Layout

### Project Structure

```
app/
  products/
    layout.tsx
    [productId]/
      layout.tsx        -- throws an error
      error.tsx         -- cannot catch the layout error
      page.tsx
```

### The Layout That Throws

```tsx
// app/products/[productId]/layout.tsx
function getRandomInt(count: number): number {
  return Math.floor(Math.random() * count);
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const random = getRandomInt(2);

  if (random === 1) {
    throw new Error("Error loading product");
  }

  return (
    <div>
      <h2>Featured Product</h2>
      {children}
    </div>
  );
}
```

### The Error Boundary (Ineffective Here)

```tsx
// app/products/[productId]/error.tsx
"use client";

export default function ProductError({ error }: { error: Error }) {
  return <div>Error: {error.message}</div>;
}
```

When the `ProductDetailLayout` throws an error, the `error.tsx` in the same `[productId]` segment does **not** catch it. The error propagates up unhandled, resulting in an unhandled runtime error.

## Solution: Move the Error Boundary to the Parent Segment

To catch errors from a layout, move the `error.tsx` one level up to the parent segment:

### Updated Project Structure

```
app/
  products/
    error.tsx         -- catches errors from products/layout and below
    layout.tsx
    [productId]/
      layout.tsx      -- throws an error
      page.tsx
```

### Parent Error Boundary

```tsx
// app/products/error.tsx
"use client";

export default function ProductsError({ error }: { error: Error }) {
  return (
    <div>
      <h2>Products section error</h2>
      <p>{error.message}</p>
    </div>
  );
}
```

Now when `ProductDetailLayout` throws an error:
1. The error bubbles up past `[productId]` (no catching error boundary)
2. It reaches `products/error.tsx` which catches it
3. The error UI replaces the products route content
4. Higher-level layouts (e.g., root layout with header/footer) remain intact

## Component Hierarchy After Fix

```
<RootLayout>
  <ErrorBoundary (products/error.tsx)>    <-- Catches layout errors
    <ProductsLayout>
      <ProductIdLayout>                   <-- Error thrown here
        <Page />
      </ProductIdLayout>
    </ProductsLayout>
  </ErrorBoundary>
</RootLayout>
```

## Error Boundaries and Layouts: Placement Guide

| Error Source | Error Boundary Location | Effective? |
|-------------|------------------------|------------|
| `page.tsx` | Same segment | Yes |
| `page.tsx` | Parent segment | Yes (less granular) |
| `layout.tsx` | Same segment | **No** |
| `layout.tsx` | Parent segment | Yes |
| `template.tsx` | Same segment | **No** |
| `template.tsx` | Parent segment | Yes |

## Best Practices

- Always place error boundaries in the **parent** segment if you need to catch layout errors
- Place error boundaries in the **same** segment to catch page and child component errors with maximum granularity
- For root layout errors, use `global-error.tsx` (covered in the next tutorial)
- Test error scenarios thoroughly to ensure error boundaries are positioned correctly

## Key Points

- `error.tsx` in the same segment cannot catch errors from that segment's `layout.tsx`
- The layout renders **above** the error boundary in the component tree
- To catch layout errors, move `error.tsx` to the parent segment
- Higher-level layouts and the root layout remain unaffected when a child layout error is caught
- This is a limitation of React Error Boundaries, inherent to the component nesting model
