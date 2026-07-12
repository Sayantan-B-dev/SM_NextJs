# Not Found Page

Next.js automatically serves a 404 page for routes that do not exist. You can customize this page to match your application's design.

## Default 404 Page

When you visit a route that does not exist in your app folder (e.g., `/building`), Next.js shows a basic 404 page. While sufficient for development, production sites should have a custom design.

## Creating a Custom Not Found Page

Create a file named `not-found.tsx` in your `app` folder:

```
src/
  app/
    not-found.tsx
```

```typescript
// src/app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <p>Could not find requested resource</p>
    </div>
  );
}
```

The file name must be exactly `not-found.tsx` (hyphenated). This is a Next.js convention. The component renders automatically for any unmatched route.

## Programmatically Triggering Not Found

Use the `notFound` function from `next/navigation` to trigger a 404 response conditionally:

```typescript
// src/app/products/[productId]/reviews/[reviewId]/page.tsx
import { notFound } from "next/navigation";

export default async function ProductReview({
  params,
}: {
  params: Promise<{ productId: string; reviewId: string }>;
}) {
  const { productId, reviewId } = await params;

  if (parseInt(reviewId) > 1000) {
    notFound();
  }

  return (
    <h1>
      Review {reviewId} for product {productId}
    </h1>
  );
}
```

## Scoped Not Found Pages

You can create route-specific 404 pages by placing `not-found.tsx` in a nested folder:

```
src/
  app/
    not-found.tsx              -> Global 404
    products/
      [productId]/
        reviews/
          [reviewId]/
            not-found.tsx      -> Review-specific 404
```

```typescript
// src/app/products/[productId]/reviews/[reviewId]/not-found.tsx
export default function ReviewNotFound() {
  return (
    <div>
      <h2>Review Not Found</h2>
      <p>This review does not exist</p>
    </div>
  );
}
```

Next.js uses the most specific `not-found` component it can find, falling back to the global one if no scoped version exists.

## Using Hooks in Not Found Components

The `not-found` component does not accept props. To access route parameters, use the `usePathname` hook:

```typescript
"use client";

import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const productId = segments[2];
  const reviewId = segments[4];

  return (
    <div>
      <h2>
        Review {reviewId} not found for product {productId}
      </h2>
    </div>
  );
}
```

**Important**: The `usePathname` hook requires the `"use client"` directive since hooks are only available in Client Components.

## Summary

| Approach | File | Use Case |
|----------|------|----------|
| Global custom 404 | `app/not-found.tsx` | Default for all unmatched routes |
| Scoped custom 404 | `app/.../not-found.tsx` | Section-specific 404 pages |
| Programmatic 404 | `notFound()` function | Conditional 404 based on data |
| Dynamic message | `usePathname()` hook | Display route-specific info in 404 |
