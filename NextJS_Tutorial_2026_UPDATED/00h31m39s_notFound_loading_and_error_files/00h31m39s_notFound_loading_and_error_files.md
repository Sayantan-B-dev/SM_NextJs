# notFound, Loading, and Error Files in Next.js

Next.js provides three special files that handle the three states of any data-driven page: loading (pending), error (failure), and not-found (empty/missing). These files leverage React Suspense and Error Boundaries without requiring manual setup.

## The `notFound()` Function

`notFound()` from `next/navigation` triggers the nearest `not-found.tsx` file. Call it when a resource does not exist or when a condition is not met.

```tsx
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );

  if (!res.ok) {
    notFound();
  }

  const post = await res.json();
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}
```

## `not-found.tsx` (Global and Route-Specific)

Place `not-found.tsx` in a route segment to render a custom 404 UI for that segment and its children. A top-level `app/not-found.tsx` acts as the global 404 page.

```tsx
// app/not-found.tsx -- global 404 page
import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link href="/">Go home</Link>
    </div>
  );
}
```

```tsx
// app/posts/not-found.tsx -- 404 for /posts/* routes
import Link from "next/link";

export default function PostNotFound() {
  return (
    <div>
      <h2>Post Not Found</h2>
      <p>The requested post could not be found.</p>
      <Link href="/posts">Back to posts</Link>
    </div>
  );
}
```

Route-specific `not-found.tsx` takes precedence over the global one for that route segment.

## `loading.tsx` (Suspense-Based Fallback)

`loading.tsx` wraps the page content in a React Suspense boundary automatically. It renders while the page component (usually an async Server Component) is fetching data.

```tsx
// app/posts/loading.tsx
export default function PostsLoading() {
  return (
    <div>
      <p>Loading posts...</p>
      <div style={{ height: 200, background: "#f0f0f0", borderRadius: 8 }} />
    </div>
  );
}
```

The loading file can contain skeleton UI, spinners, or any placeholder content. It is automatically shown during the initial load and on client-side navigations.

## `error.tsx` (Client Component with Error/Reset Props)

`error.tsx` is a client component that receives `error` and `reset` props. It must be a client component (use `"use client"` directive).

```tsx
// app/posts/error.tsx
"use client";

export default function PostsError({
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
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

| Prop | Type | Description |
|---|---|---|
| `error` | Error | The error that was thrown, with an optional `digest` property |
| `reset` | () => void | Call to re-render the segment, attempting recovery |

### How error.tsx works:

1. An error is thrown during rendering of a Server Component or Client Component in the segment.
2. Next.js catches it with an Error Boundary defined by the `error.tsx` file.
3. The Error Boundary renders `error.tsx` with the error details.
4. Clicking the reset button re-renders the segment, which attempts the fetch again.

## Composing Patterns Together

Combine all three files for a robust user experience:

```
app/
  posts/
    page.tsx          --> fetches and displays posts
    loading.tsx       --> skeleton UI while posts load
    error.tsx         --> error UI with retry button
    not-found.tsx     --> 404 for missing routes under /posts
    [id]/
      page.tsx        --> fetches single post, calls notFound if missing
```

This ensures every data-fetching state (loading, success, error, empty) is handled gracefully.

## Custom 404 Pages

To override the default 404 page, create `app/not-found.tsx`. This applies to all routes that do not match any defined page.

```tsx
// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
      <h1 style={{ fontSize: "4rem", margin: 0 }}>404</h1>
      <p>This page could not be found.</p>
      <Link href="/">Return home</Link>
    </div>
  );
}
```

## Using notFound() in Components

Calling `notFound()` from inside a deeply nested component still triggers the nearest `not-found.tsx` parent boundary:

```tsx
"use client";

import { notFound } from "next/navigation";

export default function PostContent({ id }: { id: string }) {
  // Some check that fails
  if (!id) {
    notFound();
  }
  return <div>Post content here</div>;
}
```

## Summary

| File | Purpose | Component Type |
|---|---|---|
| `loading.tsx` | Shows while the page data is loading | Server or Client |
| `error.tsx` | Shows when an error occurs during rendering | Client (requires `"use client"`) |
| `not-found.tsx` | Shows when `notFound()` is called or route is unmatched | Server or Client |
