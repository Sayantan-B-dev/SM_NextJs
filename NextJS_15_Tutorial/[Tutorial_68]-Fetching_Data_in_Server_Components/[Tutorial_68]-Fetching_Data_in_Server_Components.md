# Fetching Data in Server Components

## Overview

Server components in Next.js support the `async` and `await` keywords directly. This means you can write data fetching code just like regular JavaScript without `useState`, `useEffect`, or any state management boilerplate. Server components can `await` fetch requests and render with the data immediately available.

---

## The Simplicity of Server Component Fetching

### Example: Fetching Users

```tsx
// app/users-server/page.tsx
type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
};

export default async function UsersServer() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/users"
  );
  const users: User[] = await response.json();

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <strong>{user.name}</strong> (@{user.username})
          <br />
          Email: {user.email}
          <br />
          Phone: {user.phone}
        </li>
      ))}
    </ul>
  );
}
```

That is it. No `useState`, no `useEffect`, no loading state variables. The component is `async`, it `await`s the data, and renders it directly.

---

## Comparison: Client vs Server Component Data Fetching

| Aspect | Client Component | Server Component |
|---|---|---|
| Syntax | `useState` + `useEffect` | `async` / `await` directly |
| Boilerplate | State variables, effect, cleanup | Just the fetch call |
| Loading state | Manual (state variable) | Automatic (via `loading.tsx`) |
| Error handling | Manual (try/catch + state) | Automatic (via `error.tsx`) |
| Bundle size | Includes fetch logic in client JS | Zero client-side JS for data |
| Performance | Waterfall (render -> fetch -> re-render) | Data fetched during server render |

---

## Request Memoization

One of the most powerful features of server components is **request memoization**. React deduplicates identical fetch requests within the same render pass.

### The Problem This Solves

In a component tree like:

```
Layout (fetches users)
  |
  +-- Navigation (fetches users)
        |
        +-- Sidebar (fetches users)
```

Without memoization, the same `/api/users` endpoint would be called three times. With memoization, React makes only **one** fetch and reuses the result.

### How It Works

```tsx
// Multiple components can fetch the same URL during the same render pass
// React deduplicates them automatically

async function ComponentA() {
  const users = await fetch("https://api.example.com/users").then(r => r.json());
  // ...
}

async function ComponentB() {
  const users = await fetch("https://api.example.com/users").then(r => r.json());
  // Only ONE network request is made
}
```

Key characteristics of request memoization:

| Feature | Detail |
|---|---|
| Scope | Per render pass (one server-side render) |
| Deduplication key | URL + options |
| Duration | Only during the current render |
| Revalidation | Not cached across requests (use Data Cache for that) |
| Availability | React feature, included in Next.js |

---

## Best Practices

| Practice | Description |
|---|---|
| Make components `async` | Server components support top-level `await` |
| Fetch where needed | Take advantage of memoization -- fetch data in the component that uses it |
| Avoid passing data through props | Instead of prop drilling, fetch directly in each component |
| Use `loading.tsx` | Provides an automatic loading UI during data fetching |
| Use `error.tsx` | Provides an automatic error UI when fetches fail |

---

## Key Takeaway

> Server component data fetching is remarkably simple: just `async` and `await` with the `fetch` API. No state management, no effects, no boilerplate. Combine this with request memoization and you can fetch data exactly where you need it without worrying about duplicate network requests.
