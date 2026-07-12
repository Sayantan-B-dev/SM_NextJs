# Client Components

Client Components are React components that render on both the server (during pre-rendering) and the client (where they become interactive). They enable the use of browser APIs, event handlers, React hooks, and state.

---

## 1. The `"use client"` Directive

To mark a component as a Client Component, add `"use client"` at the very top of the file:

```tsx
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### What `"use client"` Enables

| Feature | Available in Client Components |
|---|---|
| `useState`, `useReducer` | Yes |
| `useEffect`, `useLayoutEffect` | Yes |
| `useContext`, `createContext` | Yes |
| `useRef`, `useImperativeHandle` | Yes |
| `onClick`, `onChange`, `onSubmit`, etc. | Yes |
| `window`, `document`, `localStorage` | Yes |
| Browser-only APIs (WebSockets, Canvas, etc.) | Yes |
| Custom hooks that use any of the above | Yes |

### What `"use client"` Does Not Enable

Client components do **not** have direct access to:
- Server-only resources (databases, file system, server-only environment variables).
- Server Actions imported from client code (but you can call them via `startTransition` or `bind`).
- Async component functions (a Client Component cannot be `async`).

---

## 2. The "use client" Boundary Problem

When you add `"use client"` to a component, that component **and all its children** become part of the client component tree. This means even if a child file does not have `"use client"`, it will still execute on the client.

```tsx
"use client";
// ParentComponent.tsx
import { ChildComponent } from "./ChildComponent";

export function ParentComponent() {
  return <ChildComponent />;
}
```

```tsx
// ChildComponent.tsx -- NO "use client"
export function ChildComponent() {
  // This still runs on the client because ParentComponent has "use client"
  return <div>I am client-rendered too</div>;
}
```

### The Problem

If a file without `"use client"` uses server-only features (like a database query or `fs` module), importing it into a client component will break at build or runtime.

```tsx
"use client";
// DON'T: This will fail
import { getPosts } from "@/lib/db"; // tries to use database on client

export function PostList() {
  const posts = getPosts(); // Error: fs/db not available on client
  // ...
}
```

### The Solution: Composition Pattern

Separate interactive and non-interactive concerns into different files. A **Server Component** fetches data, a **Client Component** handles interactivity, and the Server Component wraps the Client Component.

```tsx
// app/posts/page.tsx -- Server Component (no "use client")
import { getPosts } from "@/lib/db";
import { UpvoteButton } from "./upvote-button";

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          {post.title}
          <UpvoteButton postId={post.id} initialVotes={post.votes} />
        </li>
      ))}
    </ul>
  );
}
```

```tsx
// app/posts/upvote-button.tsx -- Client Component
"use client";

import { useState } from "react";
import { upvotePost } from "@/app/actions";

export function UpvoteButton({
  postId,
  initialVotes,
}: {
  postId: string;
  initialVotes: number;
}) {
  const [votes, setVotes] = useState(initialVotes);

  return (
    <button
      onClick={async () => {
        setVotes(votes + 1);
        await upvotePost(postId);
      }}
    >
      Upvote ({votes})
    </button>
  );
}
```

**Key insight**: The client boundary is at `UpvoteButton`, not at `PostsPage`. `PostsPage` remains a Server Component that can safely query the database.

---

## 3. Client Components During Server-Side Rendering (SSR)

During pre-rendering (both SSG and SSR), Client Components execute on the **server** to generate the initial HTML. This process is called **pre-rendering**.

```tsx
"use client";
import { useState, useEffect } from "react";

export function Clock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <div>{time}</div>;
}
```

1. **Server pre-renders**: `useState()` creates initial state. The HTML output includes the first rendered value.
2. **HTML sent to browser**: The user sees the pre-rendered HTML immediately (no waiting for JavaScript).
3. **Hydration**: React loads on the client, attaches event handlers, and runs `useEffect`.
4. **Interactivity**: The clock starts ticking.

### Important Implications

- `useState` initial value is used during pre-rendering and during hydration. If the initial value is expensive to compute, wrap it in a function: `useState(() => expensiveComputation())`.
- `useEffect` does **not** run on the server. It only runs on the client after hydration. This is why effects are safe for browser-only code.
- Avoid accessing `window` or `document` at the top level of a Client Component. Use `useEffect` or guard with `typeof window !== 'undefined'`.

---

## 4. Best Practices

### Push `"use client"` as Deep as Possible

Add `"use client"` to leaf components that need interactivity, not to high-level page components. This preserves server rendering for the majority of your app.

```tsx
// GOOD
// app/page.tsx (Server Component)
// app/subscribe-form.tsx (Server Component, renders form HTML)
// app/subscribe-button.tsx ("use client", only the button is interactive)
```

```tsx
// BAD
// app/page.tsx ("use client") -- entire page is now client-rendered
```

### Extract Interactive Islands

Identify the smallest piece of UI that needs interactivity and extract it into its own Client Component.

```tsx
// app/dashboard/page.tsx
import { DashboardChart } from "./dashboard-chart";
import { getStats } from "@/lib/data";

export default async function DashboardPage() {
  const stats = await getStats();
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Only the chart needs client interactivity */}
      <DashboardChart data={stats} />
      {/* The rest is pure server-rendered HTML */}
      <div>{stats.totalUsers} total users</div>
    </div>
  );
}
```

### Pass Data as Props, Not via Client Imports

Server Components fetch data and pass it down to Client Components as props.

```tsx
// Server Component
export default async function Page() {
  const posts = await db.post.findMany();
  return <ClientList posts={posts} />;
}

// Client Component
"use client";
export function ClientList({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState("");
  // filter logic...
}
```

### Use Server Actions for Mutations

Even in Client Components, mutations should be handled by Server Actions, not by making direct `fetch()` calls to Route Handlers (unless you have a specific reason).

```tsx
"use client";
import { createPost } from "@/app/actions"; // Server Action

export function PostForm() {
  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  );
}
```

Or call a Server Action programmatically:

```tsx
"use client";
import { upvotePost } from "@/app/actions";
import { useTransition } from "react";

export function UpvoteButton({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => upvotePost(postId))}
      disabled={isPending}
    >
      {isPending ? "Upvoting..." : "Upvote"}
    </button>
  );
}
```

---

## 5. Client Component Pitfalls

| Pitfall | Solution |
|---|---|
| Adding `"use client"` to a page that could stay server-rendered | Identify the smallest interactive piece and extract it |
| Importing server-only code into a client component | Use the composition pattern; fetch data in server component, pass as props |
| `window is not defined` during build | Guard with `typeof window !== 'undefined'` or use `useEffect` |
| Large client bundle | Use dynamic imports with `next/dynamic` for heavy libraries |
| Server Action imported from client but not working | Ensure the action file has `"use server"` at the top or a separate action file |

---

## 6. Summary

- Use `"use client"` to enable browser APIs, hooks, and event handlers.
- A client component's entire subtree becomes client-rendered -- keep boundaries narrow.
- Use the **composition pattern**: Server Component fetches data, Client Component handles interactivity.
- Pre-rendering generates initial HTML on the server; hydration makes it interactive.
- Push `"use client"` as deep as possible to maximize server rendering.
- Server Actions work well for mutations even inside Client Components.
