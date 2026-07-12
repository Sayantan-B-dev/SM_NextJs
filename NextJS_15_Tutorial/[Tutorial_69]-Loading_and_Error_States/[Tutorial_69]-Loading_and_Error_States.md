# Loading and Error States

## Overview

Unlike client components where loading and error states must be managed manually with state variables and conditional rendering, server components leverage Next.js file conventions for a much cleaner approach. Simply define `loading.tsx` and `error.tsx` files in the same folder as your page component.

---

## Loading State: `loading.tsx`

Add a `loading.tsx` file in any route segment to show a loading UI while the page's data is being fetched.

### Example

```tsx
// app/users-server/loading.tsx
export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
```

When a server component in the same folder fetches data, Next.js automatically shows this loading component until the data is ready.

### How It Works

1. User navigates to `/users-server`
2. Next.js immediately renders and sends `loading.tsx` to the browser
3. The server component `UsersServer` fetches data on the server
4. Once data is ready, Next.js replaces the loading UI with the actual page content

### Simulating a Delay

To see the loading state in action, add a delay in your server component:

```tsx
// app/users-server/page.tsx
export default async function UsersServer() {
  // Simulate a 2-second delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await response.json();

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

Now when you visit the page, the loading spinner displays for 2 seconds before the user list appears.

---

## Error State: `error.tsx`

Add an `error.tsx` file in the same folder to handle errors gracefully. Unlike `loading.tsx`, error components must be client components.

### Example

```tsx
// app/users-server/error.tsx
"use client";

import { useEffect } from "react";

export default function ErrorPage({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="text-red-500 p-4">
      <h2 className="text-xl font-bold">Error Fetching Users Data</h2>
      <p>{error.message}</p>
    </div>
  );
}
```

### Testing the Error State

To simulate an error, use an incorrect URL:

```tsx
// app/users-server/page.tsx
const response = await fetch("https://jsonplaceholder.typicode.com/users123");
```

Now when you visit the page, the error component renders with the error message.

---

## File Location and Scope

```
app/
  users-server/
    page.tsx          # Server component with data fetching
    loading.tsx       # Loading UI (shown during fetch)
    error.tsx         # Error UI (shown on fetch failure)
```

| File | Type | Component Type |
|---|---|---|
| `loading.tsx` | Optional | Can be server or client component |
| `error.tsx` | Optional | Must be a client component (`"use client"`) |

Both files only affect their own route segment and its nested segments.

---

## Comparison: Client vs Server Error/Loading Handling

| Aspect | Client Component | Server Component |
|---|---|---|
| Loading state | Manual `loading` state variable | Declarative `loading.tsx` file |
| Error state | Manual `error` state variable with try/catch | Declarative `error.tsx` file |
| Code organization | Inline within component | Separate file per concern |
| Server revalidation | N/A | Automatic on retry |

---

## Best Practices

| Practice | Description |
|---|---|
| Always add `loading.tsx` | Prevents blank screens during data fetching |
| Make `error.tsx` a client component | Required by Next.js convention |
| Log errors to a service | Use `useEffect` in `error.tsx` to send errors to monitoring |
| Reset error boundaries | Use `error.tsx`'s `reset()` prop to allow retry |
| Be specific | Create separate error files for different route segments |

---

## Key Takeaway

> Server components rely on file conventions (`loading.tsx` for loading states, `error.tsx` for error states) rather than inline state management. This results in cleaner code, better separation of concerns, and automatic UI transitions managed by Next.js.
