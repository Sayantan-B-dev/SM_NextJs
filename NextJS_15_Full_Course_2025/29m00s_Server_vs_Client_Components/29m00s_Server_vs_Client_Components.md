# Server vs Client Components

React components have evolved significantly. Next.js with the App Router introduces a fundamental shift: components can now be **Server Components** or **Client Components**, each with distinct capabilities and trade-offs.

---

## Evolution of React Components

| Era | Type | Description |
|-----|------|-------------|
| Pre-2019 | Class Components | ES6 classes extending `React.Component`, lifecycle methods (`componentDidMount`, etc.) |
| 2019+ | Functional Components | Plain functions with Hooks (`useState`, `useEffect`) |
| React 18+ | Server Components | Render on the server, zero client JavaScript, can be async |
| React 18+ | Client Components | Traditional components with full interactivity |

Next.js 13+ (App Router) uses Server Components by default. To opt into client-side interactivity, add the `"use client"` directive.

---

## Server Components (Default in Next.js)

Server Components render exclusively on the server. Their HTML is sent to the client, but **no JavaScript** for the component itself is shipped to the browser.

### Key Characteristics

- Rendered on the server only
- No JavaScript bundle added for the component
- Cannot use React Hooks (`useState`, `useEffect`, etc.)
- Cannot handle browser events (`onClick`, `onSubmit`, etc.)
- Can be `async` functions — fetch data directly with `await`
- Better for SEO (content is present in the initial HTML)
- Faster initial page load (less JavaScript to parse)

### Async Data Fetching (Server Component)

```tsx
// Server component (default, no "use client" directive)
export default async function UserList() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await res.json();

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} — {user.email}
        </li>
      ))}
    </ul>
  );
}
```

This pattern eliminates the need for `useEffect` + `useState` for data fetching. The data is fetched on the server and the fully rendered HTML is sent to the client.

### What Does NOT Work in Server Components

```tsx
// This will FAIL — Server components cannot use hooks
export default function Broken() {
  const [count, setCount] = useState(0); // Error!
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>; // Error!
}
```

```tsx
// This will FAIL — Server components cannot handle events
export default function NoClick() {
  return <button onClick={() => alert("clicked")}>Click me</button>; // onClick is ignored
}
```

---

## Client Components (`"use client"`)

Client Components are traditional React components that render on both the server (initial HTML) and client (hydration). They have full access to browser APIs and React features.

### Key Characteristics

- Rendered on server for initial HTML, then hydrated on client
- Full interactivity: Hooks, event handlers, browser APIs
- JavaScript is sent to the browser
- Weaker for SEO (content may depend on client-side JavaScript)
- Cannot be `async` functions

### Syntax

```tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
```

### Data Fetching in Client Components

Since client components cannot be async, use `useEffect` or a data-fetching library (React Query, SWR, etc.):

```tsx
"use client";

import { useState, useEffect } from "react";

export default function ClientUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## Comparison Table

| Aspect | Server Component | Client Component |
|--------|-----------------|-----------------|
| Rendering location | Server only | Server (initial HTML) + Client (hydration) |
| React Hooks | Not allowed | Allowed |
| Event handlers (`onClick`, etc.) | Not allowed | Allowed |
| `async` / `await` | Direct (component can be `async`) | Via `useEffect` or libraries |
| JavaScript bundle size | 0 KB added | Full component JS shipped |
| SEO | Excellent (full HTML) | Limited (depends on hydration) |
| Data fetching | Direct `await` in component | `useEffect` or external libraries |
| Browser APIs | Not accessible | Fully accessible |
| Use case | Static content, data fetching | Interactivity, forms, real-time updates |

---

## How to Decide: Server vs Client

| You need... | Use... |
|-------------|--------|
| Interactive UI (buttons, forms, toggles) | Client Component |
| Fetch and display data (no interactivity) | Server Component |
| SEO-optimized content | Server Component |
| Browser APIs (localStorage, geolocation) | Client Component |
| State management (useState, useReducer) | Client Component |
| Side effects (useEffect) | Client Component |
| A mix of both | **Composition Pattern** (see below) |

---

## The `"use client"` Boundary

- Add `"use client"` at the very top of a file (before any imports)
- All components exported from that file become Client Components
- You can import and render Server Components inside Client Components only as **children** (the Server Component cannot be directly imported into a Client Component file)

```tsx
"use client";

import { ReactNode } from "react";

// This is a Client Component wrapper
export default function ClientLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setSidebarOpen(!sidebarOpen)}>Toggle</button>
      {children} {/* Server Components can be passed as children */}
    </div>
  );
}
```

---

## Composition Pattern (Best Practice)

The most powerful pattern is composing Server and Client Components together. The Server Component handles data fetching (fast, no JS), and the Client Component handles interactivity.

```tsx
// app/page.tsx — Server Component (default)
import UserList from "./user-list";
import LikeButton from "./like-button";

export default async function Page() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await res.json();

  return (
    <div>
      <h1>Users</h1>
      <UserList users={users} />         {/* Server Component — renders list */}
      <LikeButton />                      {/* Client Component — handles likes */}
    </div>
  );
}
```

```tsx
// app/user-list.tsx — Server Component (no "use client")
import { User } from "./types";

export default function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

```tsx
// app/like-button.tsx — Client Component
"use client";

import { useState } from "react";

export default function LikeButton() {
  const [liked, setLiked] = useState(false);

  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? "Unlike" : "Like"}
    </button>
  );
}
```

This pattern gives you the best of both worlds: efficient server-side data fetching with full interactivity.

---

## Console Log Test

An easy way to verify where a component runs:

```tsx
// Server component — output appears in the terminal, not the browser console
export default function ServerComponent() {
  console.log("This logs in the SERVER terminal only");
  return <p>Server Component</p>;
}
```

```tsx
// Client component — output appears in the browser console
"use client";

export default function ClientComponent() {
  console.log("This logs in the BROWSER console only");
  return <p>Client Component</p>;
}
```

---

## Edge Cases and Gotchas

### 1. Importing Server into Client (Direct Import — Fails)

```tsx
"use client";
import ServerComponent from "./server-component"; // This will NOT work as expected
```

**Fix:** Pass Server Components as `children` or props to Client Components.

### 2. JSON Serialization

Server Components can fetch data and pass it to Client Components, but the data must be serializable (no functions, Date objects, etc.).

```tsx
// Works
export default async function Page() {
  const data = await fetchData(); // Must return plain objects/arrays/strings/numbers
  return <ClientComponent data={data} />;
}
```

### 3. Third-Party Libraries

Many third-party React components (Charts, Maps, etc.) use client-side features. Wrap them in a `"use client"` boundary.

```tsx
"use client";
import { Chart } from "react-chartjs-2";
export default Chart; // Re-export as client component
```

### 4. Mixing Patterns

A single page can have multiple Server Components and Client Components working together. Each component file declares its own boundary.

---

## Summary

- **Server Components** are the default — use them for data fetching and rendering static content
- **Client Components** require `"use client"` — use them for interactivity
- **Composition** is the recommended pattern: let Server Components fetch data and Client Components handle interactions
- Server Components reduce JavaScript bundle size and improve SEO
- Client Components provide full React functionality
