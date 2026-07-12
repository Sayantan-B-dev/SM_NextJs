# Fetching Data in Client Components

## Overview

Before server components, all React data fetching was done on the client side. While server components are now the recommended approach, client-side data fetching is still necessary for certain use cases such as real-time data, user-triggered fetches, or when using data libraries that require a browser environment.

---

## When to Use Client-Side Fetching

| Use Case | Example |
|---|---|
| Real-time updates | Chat applications, live dashboards |
| User-initiated fetches | Search, pagination, filters |
| Third-party client libraries | Apollo Client, React Query, SWR |
| Browser-required APIs | Geolocation, localStorage-based data |

---

## Example: Fetching Users from JSONPlaceholder

### Step 1: Create the Client Component

```tsx
// app/users-client/page.tsx
"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
};

export default function UsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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

### Step 2: Navigation

Visit `/users-client` in the browser. You should briefly see "Loading..." and then the list of 10 users with their name, username, email, and phone number.

---

## State Management Pattern

Client-side data fetching requires three pieces of state:

| State Variable | Type | Purpose |
|---|---|---|
| `users` | `User[]` | Stores the fetched data |
| `loading` | `boolean` | Tracks whether data is being fetched |
| `error` | `string \| null` | Stores any error message |

---

## The Boilerplate Problem

Every client-side data fetch requires the same pattern:

```tsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

This repetitive boilerplate is one of the reasons server components are preferred for data fetching.

---

## Libraries for Client-Side Fetching

For production applications, consider using a dedicated data-fetching library:

| Library | Features |
|---|---|
| **SWR** | Caching, revalidation, pagination, optimistic UI |
| **TanStack Query** (React Query) | Caching, background refetching, mutations, devtools |
| **Apollo Client** | GraphQL data fetching, caching, subscriptions |

These libraries reduce boilerplate and add features like automatic revalidation.

---

## Best Practices

| Practice | Description |
|---|---|
| Add `"use client"` | Required for using hooks in the App Router |
| Handle all states | Always handle loading, error, and success states |
| Cleanup effect | Return a cleanup function if the fetch is abortable |
| Consider libraries | Use SWR or TanStack Query for production apps |
| Prefer server components | Only use client fetching when necessary |

---

## Key Takeaway

> Client-side data fetching with `useEffect` and `useState` is familiar to React developers but comes with boilerplate. Use it only when you need real-time updates, client-interaction-dependent data, or third-party client libraries. For everything else, prefer server components.
