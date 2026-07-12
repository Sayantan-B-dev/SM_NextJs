## Profile Settings

Clerk provides a `UserProfile` component for embedding a full profile management page within your application.

### Using UserProfile in a Modal

The `UserButton` component already provides access to profile management through its dropdown's "Manage account" option, which opens a modal. For a dedicated settings page, use the `UserProfile` component.

### Dedicated Profile Page

Create an optional catch-all route for the profile page:

```tsx
// app/user-profile/[[...user-profile]]/page.tsx
import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <UserProfile path="/user-profile" />
    </div>
  );
}
```

The `path` prop tells the component which route it is mounted on, enabling Clerk to handle sub-navigation within the profile page.

### Adding a Navigation Link

Update the navigation component to include a link to the profile page:

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

### UserProfile Features

The `UserProfile` component provides the following management options:

- Update profile picture
- Update email address
- Update password
- Delete account
- Manage connected accounts (Google, GitHub, etc.)

### Customization

You can customize which sections appear in the profile page through the Clerk Dashboard under **User & Authentication > Profile**.

### Route Structure

```
app/
  user-profile/
    [[...user-profile]]/
      page.tsx          # User profile page with UserProfile component
```

The double square brackets (`[[...]]`) create an optional catch-all route, allowing Clerk's `UserProfile` component to handle internal navigation (e.g., security, account, or connected accounts tabs).
