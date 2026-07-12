## Customizing Clerk Components

Clerk components are highly customizable, allowing control over sign-up flows, styling, and page routing.

### Adding a Sign-Up Button

Add a dedicated sign-up button alongside the sign-in button:

```tsx
// components/navigation.tsx
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const Navigation = () => {
  return (
    <nav>
      <Link href="/">Next.js App</Link>
      <div>
        <SignedOut>
          <SignInButton mode="modal" />
          <SignUpButton mode="modal" />
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
};
```

### Custom Styling

Nest custom HTML button elements inside Clerk components for full styling control:

```tsx
<SignInButton mode="modal">
  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
    This is sign in
  </button>
</SignInButton>

<SignUpButton mode="modal">
  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
    This is sign up
  </button>
</SignUpButton>
```

### Dedicated Pages vs Modals

Remove the `mode="modal"` prop to use dedicated sign-in/sign-up pages instead of modals:

```tsx
<SignInButton />
<SignUpButton />
```

When using pages, Clerk hosts them on its own domain by default.

### Custom Sign-In and Sign-Up Pages

Create custom pages while keeping Clerk's auth logic:

```tsx
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn path="/sign-in" />
    </div>
  );
}
```

```tsx
// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignUp path="/sign-up" />
    </div>
  );
}
```

Update middleware to treat these routes as public:

```typescript
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);
```

### Appearance Customization

Clerk components accept an `appearance` prop for theming:

```tsx
<SignIn
  path="/sign-in"
  appearance={{
    elements: {
      card: "bg-gray-50 shadow-lg",
      headerTitle: "text-2xl font-bold",
      formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
    },
    variables: {
      colorPrimary: "#3b82f6",
      colorBackground: "#ffffff",
    },
  }}
/>
```

### Component Options Summary

| Feature | Approach |
|---------|----------|
| Modal vs Page | `mode="modal"` or remove prop |
| Custom styling | Nest `<button>` inside Clerk components |
| Custom pages | Use `SignIn`/`SignUp` components in route pages |
| Theming | Use `appearance` prop with `elements` and `variables` |
