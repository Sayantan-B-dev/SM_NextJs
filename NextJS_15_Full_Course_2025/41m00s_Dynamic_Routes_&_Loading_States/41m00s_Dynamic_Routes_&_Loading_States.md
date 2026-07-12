# Dynamic Routes and Loading States in Next.js 15

## Overview

Dynamic routes allow your application to handle variable URL segments such as user IDs, product slugs, or blog post titles. Next.js 15 introduces breaking changes to how route parameters are accessed (as Promises) and provides built-in conventions for loading states, error boundaries, and custom 404 pages.

---

## 1. Dynamic Routes

### 1.1 The `[param]` Convention

In the `app/` directory, folders wrapped in square brackets create dynamic route segments.

```
app/
  users/
    [userId]/
      page.tsx       # Matches /users/1, /users/abc, /users/42
    page.tsx         # Matches /users
```

### 1.2 Route Parameters as Promises (Next.js 15)

In Next.js 15, the `params` prop passed to page components is a **Promise** that must be awaited. This enables asynchronous rendering optimizations and incremental adoption of async patterns.

```tsx
// app/users/[userId]/page.tsx
export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return (
    <div>
      <h1>User Profile</h1>
      <p>Viewing user with ID: {userId}</p>
    </div>
  );
}
```

**Why is `params` a Promise?**
- Allows the framework to defer parameter resolution until rendering
- Enables streaming and partial rendering optimizations
- Backward-compatible -- existing single-page apps can adopt incrementally

---

## 2. Data Fetching with Dynamic Parameters

Combine dynamic route parameters with server-side data fetching using `fetch`.

```tsx
// lib/api.ts
export async function fetchUser(id: string) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`,
    { cache: "force-cache" }
  );
  if (!res.ok) return null;
  return res.json();
}

// app/users/[userId]/page.tsx
import { fetchUser } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await fetchUser(userId);

  if (!user) {
    notFound();
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Website: {user.website}</p>
    </div>
  );
}
```

---

## 3. Custom Not Found Page (`not-found.tsx`)

### 3.1 Global 404

Place a `not-found.tsx` file in the root `app/` directory to create a global 404 page:

```tsx
// app/not-found.tsx
import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <p>The requested resource could not be found.</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
```

### 3.2 Route-Specific 404

Place `not-found.tsx` inside a route segment directory to scope it:

```tsx
// app/users/[userId]/not-found.tsx
import Link from "next/link";

export default function UserNotFound() {
  return (
    <div>
      <h2>User Not Found</h2>
      <p>The user you are looking for does not exist.</p>
      <Link href="/users">Back to Users</Link>
    </div>
  );
}
```

Trigger the custom 404 using the `notFound()` function from `next/navigation`:

```tsx
import { notFound } from "next/navigation";

if (!user) {
  notFound();
}
```

---

## 4. Loading States (`loading.tsx`)

Next.js automatically wraps page components in a `<Suspense>` boundary. Export a default component from `loading.tsx` to show while the page is fetching data.

```tsx
// app/users/loading.tsx
export default function UsersLoading() {
  return (
    <div>
      <div className="spinner" />
      <p>Loading users...</p>
    </div>
  );
}
```

### 4.1 Route-Specific Loading

```tsx
// app/users/[userId]/loading.tsx
export default function UserProfileLoading() {
  return (
    <div>
      <div className="skeleton-pulse" />
      <p>Fetching user details...</p>
    </div>
  );
}
```

Loading components are automatically displayed while the page component's async operations are in progress.

---

## 5. Error States (`error.tsx`)

Error boundaries are client components that catch runtime errors in the component tree below them.

```tsx
// app/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try Again</button>
    </div>
  );
}
```

- Must include `"use client"` directive
- Receives `error` (the thrown error) and `reset` (function to re-render)
- Place at any route segment level for scoped error handling

---

## 6. Complete Working Example

### 6.1 `app/users/page.tsx` -- User List

```tsx
import Link from "next/link";

async function getUsers() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(
          (user: { id: number; name: string; email: string }) => (
            <li key={user.id}>
              <Link href={`/users/${user.id}`}>
                {user.name} --- {user.email}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
```

### 6.2 `app/users/[userId]/page.tsx` -- Single User

```tsx
import { notFound } from "next/navigation";

async function fetchUser(id: string) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await fetchUser(userId);

  if (!user) notFound();

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Website: {user.website}</p>
      <p>Company: {user.company.name}</p>
    </div>
  );
}
```

---

## 7. Large Project Structure Example

A production Next.js 15 project might be organized as follows:

```
src/
  app/
    cart/
      page.tsx
    checkout/
      page.tsx
    products/
      [id]/
        page.tsx
        loading.tsx
        not-found.tsx
      page.tsx
  components/
    ui/
      navbar.tsx
      button.tsx
      card.tsx
  lib/
    db.ts
    api.ts
    utils.ts
    constants.ts
  types/
    index.ts
public/
  images/
  favicon.ico
components.json
next.config.ts
package.json
tsconfig.json
```

### 7.1 What Goes in `lib/`?

| File | Purpose |
|------|---------|
| `db.ts` | Database connection and queries |
| `api.ts` | External API client functions |
| `utils.ts` | Helper and utility functions |
| `constants.ts` | Application-wide constants |

### 7.2 What is `components.json`?

A configuration file used by `shadcn/ui` to manage component registry and theme settings.

---

## 8. Key Takeaways

- Dynamic routes use `[param]` folder names and must be awaited as Promises in Next.js 15
- `notFound()` triggers the nearest `not-found.tsx` boundary
- `loading.tsx` provides automatic Suspense fallback during data fetching
- `error.tsx` (client component) catches and handles runtime errors
- All four conventions (page, loading, error, not-found) can be scoped to specific route segments
- Use `components/` for reusable UI, `lib/` for business logic, and `app/` for routing
