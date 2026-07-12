## Sign In and Sign Out

Clerk provides pre-built components for handling sign-in, sign-out, and user menu functionality.

### Navigation Component

Create a navigation component to house authentication buttons:

```tsx
// components/navigation.tsx
import Link from "next/link";

export const Navigation = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100">
      <Link href="/" className="text-xl font-bold">
        Next.js App
      </Link>
      <div>{/* Auth buttons will go here */}</div>
    </nav>
  );
};
```

Include it in the root layout:

```tsx
// app/layout.tsx
import { Navigation } from "@/components/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
```

### Sign In Button

Import and add the `SignInButton` component:

```tsx
// components/navigation.tsx
import { SignInButton } from "@clerk/nextjs";

export const Navigation = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100">
      <Link href="/" className="text-xl font-bold">
        Next.js App
      </Link>
      <div>
        <SignInButton mode="modal" />
      </div>
    </nav>
  );
};
```

The `mode="modal"` prop opens a modal dialog instead of redirecting to a separate page.

### Sign Out Button

Add a sign-out button:

```tsx
import { SignInButton, SignOutButton } from "@clerk/nextjs";

export const Navigation = () => {
  return (
    <nav>
      <Link href="/">Next.js App</Link>
      <div>
        <SignInButton mode="modal" />
        <SignOutButton />
      </div>
    </nav>
  );
};
```

### User Button

Clerk's `UserButton` provides a dropdown with sign-out and account management options:

```tsx
import { SignInButton, UserButton } from "@clerk/nextjs";

export const Navigation = () => {
  return (
    <nav>
      <Link href="/">Next.js App</Link>
      <div>
        <SignInButton mode="modal" />
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
};
```

The `UserButton` dropdown includes:

- **Sign out** — Ends the current session.
- **Manage account** — Opens a modal with profile management options (profile picture, email, password, account deletion, etc.).

### Component Reference

| Component | Purpose |
|-----------|---------|
| `SignInButton` | Initiates sign-in flow |
| `SignOutButton` | Signs the user out |
| `UserButton` | Dropdown menu with sign-out and account management |

### Key Props

| Prop | Type | Description |
|------|------|-------------|
| `mode` | `"modal"` \| `"redirect"` | How the sign-in flow is displayed |
| `afterSignOutUrl` | `string` | URL to redirect to after sign-out |
| `afterSignInUrl` | `string` | URL to redirect to after sign-in |
| `afterSignUpUrl` | `string` | URL to redirect to after sign-up |
