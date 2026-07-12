# Conditional Routes

## Overview

Parallel routes enable conditional rendering of entirely different page layouts under the same URL. This is useful for scenarios such as showing a dashboard to authenticated users while displaying a login page to unauthenticated visitors -- all without changing the route structure.

## Authentication-Based Conditional Rendering

### Directory Structure

```
app/
  complex-dashboard/
    @login/
      page.tsx
    @children/
      page.tsx
    @users/
      page.tsx
    @revenue/
      page.tsx
    @notifications/
      page.tsx
    layout.tsx
    page.tsx
```

### Creating a Login Slot

**`@login/page.tsx`**:

```tsx
export default function LoginSlot() {
  return (
    <div>
      <h2>Please Login to Continue</h2>
    </div>
  );
}
```

### Updating the Layout

The layout receives the `login` slot as a prop alongside the other slots. A conditional check determines which UI to render.

**`complex-dashboard/layout.tsx`**:

```tsx
interface DashboardLayoutProps {
  children: React.ReactNode;
  users: React.ReactNode;
  revenue: React.ReactNode;
  notifications: React.ReactNode;
  login: React.ReactNode;
}

export default function DashboardLayout(props: DashboardLayoutProps) {
  const isLoggedIn = false;

  if (isLoggedIn) {
    return (
      <div>
        <div>{props.children}</div>
        <div>{props.users}</div>
        <div>{props.revenue}</div>
        <div>{props.notifications}</div>
      </div>
    );
  }

  return <div>{props.login}</div>;
}
```

## Behavior

| `isLoggedIn` Value | Rendered Content          |
|--------------------|---------------------------|
| `false`            | Login slot only           |
| `true`             | All dashboard slots       |

## Benefits of Conditional Parallel Routes

- **Separated code**: Login logic and dashboard logic live in different slots with no coupling
- **Same URL**: The URL structure remains unchanged regardless of authentication state
- **Independent error and loading states**: Each slot can define its own `loading.tsx` and `error.tsx`
- **Subnavigation within slots**: The login slot can contain its own sub-routes (e.g., signup, forgot password) while remaining conditionally rendered

## Practical Usage

In a real application, authentication status would come from an auth provider or server-side session:

```tsx
// Example integration with an auth hook
import { useAuth } from "@/lib/auth";

export default function DashboardLayout(props: DashboardLayoutProps) {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  if (isLoggedIn) {
    return (
      <div>
        <div>{props.children}</div>
        <div>{props.users}</div>
        <div>{props.revenue}</div>
        <div>{props.notifications}</div>
      </div>
    );
  }

  return <div>{props.login}</div>;
}
```

## Key Points

- Conditional routes rely on parallel route slots and layout-level logic
- The slot itself does not need any special configuration -- the condition lives in the layout
- Switching between authenticated and unauthenticated views is instantaneous during client-side transitions
- Restart the development server if layout changes do not take effect
