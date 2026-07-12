# Recovering from Errors

## Overview

Some errors are permanent (e.g., invalid data), while others are temporary (e.g., network timeouts). The `error.tsx` file provides a `reset` function that allows users to retry rendering the failed segment. When combined with `router.refresh()`, this enables full server-side recovery.

## Basic Error Recovery with reset

The simplest recovery mechanism uses the `reset` function provided to the error boundary:

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
      <h2>Error loading review</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try Again</button>
    </div>
  );
}
```

When the user clicks "Try Again":
1. `reset()` attempts to re-render the error boundary's content
2. If the error was caused by a transient issue, the component may render successfully

## Limitation of Basic reset

The basic `reset()` function only triggers a client-side re-render. If the page component is a **server component**, the error may persist because the re-render happens on the client without fetching fresh data from the server.

## Server-Side Recovery with router.refresh()

For complete recovery (especially with server components), combine `reset()` with `router.refresh()` using `startTransition` from React:

```tsx
// app/products/[productId]/reviews/[reviewId]/error.tsx
"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  const reload = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <div>
      <h2>Error loading review</h2>
      <p>{error.message}</p>
      <button onClick={reload}>Try Again</button>
    </div>
  );
}
```

### Why This Works

| Step | Action | Purpose |
|------|--------|---------|
| `router.refresh()` | Triggers a server-side re-render of the current route | Fetches fresh data from the server |
| `reset()` | Re-renders the error boundary | Attempts to render the segment with the new data |
| `startTransition()` | Wraps the calls in a React transition | Defers execution to the next render phase, allowing React to handle pending state updates |

Without `startTransition`, the `reset()` call might complete before `router.refresh()` finishes, resulting in the same stale data being re-rendered. By wrapping both in `startTransition`, the refresh is processed first, and then the reset occurs with updated data.

## Complete Error Recovery Example

Here is the full error flow from the page component to the error boundary:

```tsx
// app/products/[productId]/reviews/[reviewId]/page.tsx
function getRandomInt(count: number): number {
  return Math.floor(Math.random() * count);
}

export default async function ReviewDetail({
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
      <h1>Review {params.reviewId} for Product {params.productId}</h1>
      <p>Review content loaded successfully.</p>
    </div>
  );
}
```

```tsx
// app/products/[productId]/reviews/[reviewId]/error.tsx
"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function ReviewError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  const handleRetry = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <div>
      <h2>Unable to load review</h2>
      <p>{error.message}</p>
      <button onClick={handleRetry}>Try Again</button>
    </div>
  );
}
```

## Error Recovery Flow

```
1. User navigates to /products/1/reviews/1
2. Page component throws an error (random === 1)
3. Error boundary catches the error and renders error.tsx
4. User sees the error message and clicks "Try Again"
5. router.refresh() requests fresh data from the server
6. reset() attempts to re-render the page component
7. If the error was transient, the page loads successfully
8. If the error persists, the error boundary catches it again
```

## When to Use Each Recovery Strategy

| Strategy | Use Case |
|----------|----------|
| `reset()` only | Client components where state can be reset locally |
| `reset()` + `router.refresh()` | Server components that need fresh data from the server |
| `startTransition` wrapping | Always recommended when combining refresh and reset to ensure proper execution order |

## Key Points

- The `reset` function attempts a client-side re-render of the error boundary content
- For server components, combine `reset()` with `router.refresh()` for complete server-side recovery
- Use `startTransition` from React to wrap the refresh and reset calls
- `startTransition` ensures React processes the refresh before the reset
- Clicking "Try Again" may hit the same error again if the underlying issue is persistent
- Error recovery is particularly useful for transient issues like network failures or temporary server errors
