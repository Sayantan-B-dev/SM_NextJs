## Role-Based Access Control

Role-Based Access Control (RBAC) allows different permission levels for different users. Clerk provides user metadata and session customization to implement RBAC.

### Step 1: Configure Session Token

In the Clerk Dashboard, navigate to **Configure > Sessions > Customize session token**.

Add the following JSON to include user metadata in the session token:

```json
{
  "metadata": "{{user.public_metadata}}"
}
```

This makes public metadata available in the session token, allowing role checks without extra network requests.

### Step 2: Define TypeScript Types

Create a global type definition for role types:

```typescript
// types/globals.d.ts
export {};

type Roles = "admin" | "moderator";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
```

### Step 3: Set User Roles

Assign roles to users via the Clerk Dashboard under **Users > Select a user > Edit > Public metadata**:

```json
{
  "role": "admin"
}
```

Or programmatically using Clerk's API:

```typescript
import { clerkClient } from "@clerk/nextjs/server";

await clerkClient.users.updateUserMetadata(userId, {
  publicMetadata: { role: "admin" },
});
```

### Step 4: Check Roles in Middleware

Restrict protected routes based on roles:

```typescript
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    await auth.protect((has) => has({ role: "admin" }));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

### Step 5: Role Checks in Components

Server-side role check:

```tsx
import { auth } from "@clerk/nextjs/server";

export default async function AdminPanel() {
  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;

  if (role !== "admin") {
    return <p>Access denied. Admins only.</p>;
  }

  return <div>Admin Panel Content</div>;
}
```

Client-side role check:

```tsx
"use client";

import { useAuth } from "@clerk/nextjs";

export const AdminButton = () => {
  const { sessionClaims } = useAuth();
  const role = sessionClaims?.metadata?.role;

  if (role !== "admin") return null;

  return <button>Admin Action</button>;
};
```

### RBAC Architecture

```
User -> Clerk Session Token (contains role from public_metadata)
         |
         +--> Middleware: Protect admin routes
         |
         +--> Server Components: Check role before rendering
         |
         +--> Client Components: Conditionally show UI
```

### Role Hierarchy Example

| Role | Permissions |
|------|-------------|
| `admin` | Full access — manage moderators, system settings |
| `moderator` | Moderate content, manage users |
| (none) | Basic user access only |
