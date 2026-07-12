# Handling Global Errors

## Overview

Since `error.tsx` cannot catch errors from a `layout.tsx` in the same segment, a question arises: **How do we handle errors in the root layout?** The root layout has no parent segment to host an error boundary.

Next.js provides a special file called **`global-error.tsx`** that serves as the last line of defense. It sits at the root of the application and catches errors that no other error boundary can handle -- including errors in the root layout itself.

## When global-error.tsx Is Needed

| Scenario | Error Boundary |
|----------|---------------|
| Error in a page component | `error.tsx` in the same or parent segment |
| Error in a nested layout | `error.tsx` in the parent segment |
| Error in the **root layout** | **`global-error.tsx`** |
| Error not caught by any other boundary | **`global-error.tsx`** |

## Project Structure

```
app/
  global-error.tsx
  layout.tsx
  error-wrapper.tsx   (optional, to simulate root layout errors)
  page.tsx
```

## Simulating an Error in the Root Layout

To test `global-error.tsx`, we need a way to trigger an error in the root layout. One approach is to create a wrapper component that can throw an error on demand:

```tsx
// app/error-wrapper.tsx
"use client";

import { useState } from "react";

function ErrorSimulator({ message }: { message: string }) {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error(message);
  }

  return null;
}

export default function ErrorWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [simulateError, setSimulateError] = useState(false);

  return (
    <div>
      {simulateError && <ErrorSimulator message="Root layout error" />}
      <button onClick={() => setSimulateError(true)}>
        Simulate Global Error
      </button>
      {children}
    </div>
  );
}
```

Then use the wrapper in the root layout:

```tsx
// app/layout.tsx
import ErrorWrapper from "./error-wrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorWrapper>{children}</ErrorWrapper>
      </body>
    </html>
  );
}
```

## Creating global-error.tsx

```tsx
// app/global-error.tsx
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1>Something went wrong!</h1>
          <p>{error.message}</p>
          <button onClick={() => reset()}>Try Again</button>
        </div>
      </body>
    </html>
  );
}
```

### Key Difference from error.tsx

`global-error.tsx` **must** include its own `<html>` and `<body>` tags because:

- The root layout may have failed to render
- Without its own HTML shell, there would be no valid HTML document structure
- It replaces the entire root layout when activated

In contrast, `error.tsx` renders inside the existing layout and does not need its own HTML tags.

## Error Boundary Hierarchy

```
<GlobalErrorBoundary (global-error.tsx)>   -- catches everything else
  <RootLayout>
    <ErrorBoundary (products/error.tsx)>    -- catches products section errors
      <ProductsLayout>
        <ErrorBoundary (reviews/error.tsx)> -- catches review errors
          <ReviewPage />
        </ErrorBoundary>
      </ProductsLayout>
    </ErrorBoundary>
  </RootLayout>
</GlobalErrorBoundary>
```

Error propagation order:
1. Error occurs in the deepest component
2. React checks if the nearest error boundary can handle it
3. If not, it bubbles up to the next error boundary
4. Continues until it reaches `global-error.tsx`
5. If even `global-error.tsx` is not present, the app shows an unhandled error

## Complete Example

```tsx
// app/global-error.tsx
"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
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
    <html>
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <h1>Critical Error</h1>
          <p style={{ color: "red" }}>{error.message}</p>
          <p>An unexpected error occurred. Please try again.</p>
          <button onClick={handleRetry}>Retry</button>
        </div>
      </body>
    </html>
  );
}
```

## Best Practices

- Use `global-error.tsx` as your **last resort** error handler
- Always include proper `<html>` and `<body>` tags in `global-error.tsx`
- Provide a clear, user-friendly message rather than raw error output
- Include a retry mechanism using `reset()` and optionally `router.refresh()`
- Log the error for debugging (e.g., `console.error(error)` or send to an error reporting service)
- Do not replace well-placed `error.tsx` boundaries with `global-error.tsx` -- use it only for uncaught errors

## Key Points

- `global-error.tsx` is the only way to catch errors thrown in the **root layout**
- It must include its own `<html>` and `<body>` tags
- It acts as the last line of defense for all unhandled errors in the application
- It replaces the entire root layout when activated
- Use it sparingly -- prefer granular `error.tsx` boundaries for most cases
- The `error` and `reset` props work the same way as in regular `error.tsx`
