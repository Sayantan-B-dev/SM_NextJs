# Error Handling

## Overview

The `error.tsx` file is a special Next.js file that implements error boundaries for route segments. It catches unexpected errors in the component tree and displays a fallback UI instead of crashing the entire application.

Without error handling, an error in a deeply nested component can break the entire page. With `error.tsx`, errors are contained to the affected segment while the rest of the application continues to function.

## Project Structure

```
app/
  products/
    [productId]/
      reviews/
        [reviewId]/
          page.tsx
          error.tsx
```

## Simulating an Error

Before implementing error handling, let's simulate an error in a review page:

```tsx
// app/products/[productId]/reviews/[reviewId]/page.tsx
function getRandomInt(count: number): number {
  return Math.floor(Math.random() * count);
}

export default function ReviewDetail({
  params,
}: {
  params: { productId: string; reviewId: string };
}) {
  const random = getRandomInt(2);

  if (random === 1) {
    throw new Error("Error loading review");
  }

  return (
    <div>
      <h1>
        Review {params.reviewId} for Product {params.productId}
      </h1>
      <p>This is the review content.</p>
    </div>
  );
}
```

When the random number is 1, an error is thrown. Without an error boundary, this error would break the entire application and show either:
- In development: An overlay with the error details
- In production: A generic "Application error: a server-side exception has occurred" message

## Creating an Error Boundary

Create an `error.tsx` file adjacent to the page that might throw:

```tsx
// app/products/[productId]/reviews/[reviewId]/error.tsx
"use client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Error in Review ID</h2>
      <p>{error.message}</p>
    </div>
  );
}
```

### Important: Client Component Requirement

`error.tsx` **must** be a client component (add the `"use client"` directive at the top). Error boundaries in React require client-side lifecycle methods to catch errors.

## How Error Boundaries Work

| Aspect | Behavior |
|--------|----------|
| Scope | Catches errors in the page, nested child segments, and any components within them |
| Recovery | Provides a `reset` function to attempt re-rendering |
| Layout preservation | The layout component in the same segment **remains intact** |
| Client requirement | Must use `"use client"` directive |

## Error Boundary Props

The error component receives two props:

```tsx
"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try Again</button>
    </div>
  );
}
```

- **`error`**: An instance of `Error` with an optional `digest` property (a hash of the error message, useful for logging)
- **`reset`**: A function that attempts to re-render the segment. It does not guarantee the error will be fixed on retry

## Production vs Development Behavior

| Environment | Error Display |
|-------------|---------------|
| Development | Error overlay with detailed stack trace |
| Production | Renders the `error.tsx` UI (or generic error page if no error boundary exists) |

To test the production error behavior:

```bash
npm run build
npm run start
```

## Key Points

- `error.tsx` creates a React Error Boundary that catches errors in its segment
- It must be a **client component** (`"use client"`)
- It catches errors in the page file and all nested child segments
- The layout component in the same segment **is not** affected by errors in child segments
- The `error` prop provides the error details for display or logging
- The `reset` function allows users to attempt recovery
- Without `error.tsx`, errors bubble up to the nearest error boundary or crash the app
