## Conditional UI Rendering

Clerk provides `SignedIn` and `SignedOut` components to conditionally render UI elements based on the user's authentication state.

### The Problem

Without conditional rendering, authentication buttons and profile links appear regardless of the user's sign-in state:

- The sign-in button is visible even when the user is already signed in.
- The sign-out button and profile link are visible when the user is signed out.

### Solution: SignedIn and SignedOut

Wrap elements with `SignedIn` (visible when authenticated) and `SignedOut` (visible when unauthenticated):

```tsx
// components/navigation.tsx
import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const Navigation = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100">
      <Link href="/" className="text-xl font-bold">
        Next.js App
      </Link>
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal" />
        </SignedOut>
        <SignedIn>
          <Link href="/user-profile">Profile</Link>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
};
```

### How It Works

| Component | Renders Children When |
|-----------|----------------------|
| `<SignedIn>` | User has an active session |
| `<SignedOut>` | User has no active session |

Clerk handles all the state management internally — no manual auth checks, context providers, or state variables needed in your components.

### Additional Use Cases

```tsx
// Show content only to authenticated users
<SignedIn>
  <p>Welcome back, user!</p>
</SignedIn>

// Show content only to guests
<SignedOut>
  <p>Please sign in to access this feature.</p>
  <SignInButton mode="modal" />
</SignedOut>
```

### Best Practices

- Use `SignedIn`/`SignedOut` for layout-level conditional rendering.
- For server-side checks, use `auth()` or `currentUser()` in Server Components.
- Combine with `useAuth` or `useUser` in Client Components for granular control.
