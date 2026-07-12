# Data Fetching in Server Components

Next.js Server Components can be asynchronous, allowing you to fetch data directly with `async/await` without the need for `useEffect`, `useState`, or any client-side data fetching libraries. This pattern simplifies data fetching and improves performance by moving data fetching to the server.

## Server Components Are Async by Default

In the App Router, a page or component that fetches data can be an `async` function. There is no need for `loading` states at the component level -- Next.js provides `loading.tsx` for Suspense-based loading.

```tsx
// app/posts/page.tsx
export default async function PostsPage() {
  const posts = await fetch("https://jsonplaceholder.typicode.com/posts").then(
    (res) => res.json()
  );

  return (
    <ul>
      {posts.map((post: { id: number; title: string }) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

## Direct Fetch with `await`

Server Components use the native `fetch` API directly. The data is fetched during server-side rendering and the component receives the resolved data.

```tsx
export default async function Page() {
  const response = await fetch("https://api.example.com/data");
  const data = await response.json();

  return <div>{data.message}</div>;
}
```

## No Need for `useEffect` / `useState`

In the Pages Router, you had to use `useEffect` to fetch data on the client. In the App Router, Server Components eliminate this entirely:

```tsx
// Pages Router (old way) -- requires useState and useEffect
"use client";
import { useState, useEffect } from "react";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then(setPosts);
  }, []);
  return ...;
}
```

```tsx
// App Router (new way) -- no client state needed
export default async function PostsPage() {
  const posts = await fetch("https://jsonplaceholder.typicode.com/posts").then(
    (res) => res.json()
  );
  return ...;
}
```

## Caching Behavior in Next.js 15

By default, Next.js caches `fetch` responses using its built-in Data Cache. This means repeated requests to the same URL within the same render do not result in additional network requests.

| Option | Behavior |
|---|---|
| Default (no options) | Cached automatically. Subsequent visits serve cached data. |
| `cache: "force-cache"` | Explicitly caches the response (same as default). |
| `cache: "no-store"` | Disables caching. Always fetches fresh data. |
| `next: { revalidate: 60 }` | Caches for 60 seconds, then revalidates in the background. |

```tsx
// Force fresh data every request:
const data = await fetch("https://api.example.com/data", {
  cache: "no-store",
});

// Revalidate every 60 seconds:
const data = await fetch("https://api.example.com/data", {
  next: { revalidate: 60 },
});
```

## Error Handling

Use try/catch blocks to handle fetch errors gracefully. Combined with `notFound()` or custom error boundaries, you can create robust error UX.

```tsx
export default async function PostsPage() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!res.ok) throw new Error("Failed to fetch posts");
    const posts = await res.json();
    return (
      <ul>
        {posts.map((post: { id: number; title: string }) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    );
  } catch (error) {
    return <div>Failed to load posts. Please try again later.</div>;
  }
}
```

For a more structured approach, use `error.tsx` which is a special file that wraps the route segment in an error boundary:

```tsx
// app/posts/error.tsx
"use client";

export default function Error({
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

## Parallel Data Fetching

When a page needs multiple independent data sources, fetch them in parallel to reduce total load time:

```tsx
export default async function DashboardPage() {
  // Both fetches start simultaneously
  const [posts, users] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/posts").then((r) => r.json()),
    fetch("https://jsonplaceholder.typicode.com/users").then((r) => r.json()),
  ]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Posts: {posts.length}</p>
      <p>Users: {users.length}</p>
    </div>
  );
}
```

## Reusing Fetch Logic in Utility Functions

Extract fetch logic into helper functions for reuse across components:

```ts
// lib/api.ts
export async function getPosts() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function getPost(id: string) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
}
```

```tsx
// app/posts/page.tsx
import { getPosts } from "@/lib/api";

export default async function PostsPage() {
  const posts = await getPosts();
  // ...
}
```

## How It Works Under the Hood

1. When a Server Component renders, Next.js executes the `async` function on the server.
2. The `fetch` call is intercepted by the Next.js runtime, which checks the Data Cache.
3. If cached, the response is returned immediately. Otherwise, a network request is made.
4. The response is serialized into the RSC (React Server Components) payload.
5. The client receives the rendered HTML and RSC payload, which includes the fetched data.
6. Subsequent navigations use the cached data unless `cache: "no-store"` is specified.

This architecture eliminates client-server waterfalls, reduces JavaScript bundle size, and improves perceived performance.
