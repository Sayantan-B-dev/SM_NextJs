## Read Session and User Data

Clerk provides helpers for accessing session and user data in both Server Components and Client Components.

### Server-Side Helpers

In Server Components and Route Handlers, use `auth()` and `currentUser()`:

```tsx
// app/dashboard/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const authObject = await auth();
  const userObject = await currentUser();

  console.log("Auth Object:", authObject);
  console.log("User Object:", userObject);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {userObject?.firstName}!</p>
    </div>
  );
}
```

### Auth Object Properties

```typescript
{
  userId: "user_2xxxxxxxxxxxx",    // Unique user identifier
  sessionId: "sess_2xxxxxxxxxxxx", // Current session identifier
  sessionClaims: { ... },          // Custom session claims (e.g., roles)
  redirectToSignIn: () => { ... }, // Function to redirect to sign-in
}
```

### User Object Properties

```typescript
{
  id: "user_2xxxxxxxxxxxx",
  emailAddresses: [{ emailAddress: "user@example.com" }],
  firstName: "John",
  lastName: "Doe",
  imageUrl: "https://img.clerk.com/...",
  // ... additional user fields
}
```

### Client-Side Hooks

In Client Components, use `useAuth()` and `useUser()` hooks:

```tsx
// components/counter.tsx
"use client";

import { useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";

export const Counter = () => {
  const [count, setCount] = useState(0);
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();

  return (
    <div>
      {isSignedIn ? (
        <p>Signed in as {user?.firstName}</p>
      ) : (
        <p>Not signed in</p>
      )}
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
```

### Helper Comparison

| Helper | Environment | Returns | Usage |
|--------|-------------|---------|-------|
| `auth()` | Server Components, Route Handlers | Auth object (userId, sessionId, sessionClaims) | async |
| `currentUser()` | Server Components, Route Handlers | User object (profile data, emails) | async |
| `useAuth()` | Client Components | Auth state (isSignedIn, userId) | Hook |
| `useUser()` | Client Components | User data (firstName, imageUrl, etc.) | Hook |

### Practical Usage: Database Queries

The `userId` from `auth()` is commonly used to query the database:

```tsx
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    return <p>Please sign in</p>;
  }

  const userData = await db.user.findUnique({
    where: { clerkId: userId },
  });

  return <pre>{JSON.stringify(userData, null, 2)}</pre>;
}
```
