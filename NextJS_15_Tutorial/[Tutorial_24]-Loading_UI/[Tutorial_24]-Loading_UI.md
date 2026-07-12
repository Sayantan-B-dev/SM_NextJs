# Loading UI

## Overview

The `loading.tsx` file is a special Next.js file that creates loading states for route segments. It provides immediate feedback to users while page content is being fetched or rendered, making the application feel responsive.

When a `loading.tsx` file is present in a route segment, Next.js automatically:
1. Wraps the page component (and its nested children) in a React **Suspense boundary**
2. Shows the loading component immediately while the page content loads
3. Replaces the loading component once the page content is ready

## Project Structure

```
app/
  blog/
    loading.tsx
    page.tsx
```

## Basic Loading State

Create a `loading.tsx` file in the same directory as your page:

```tsx
// app/blog/loading.tsx
export default function Loading() {
  return <h1>Loading...</h1>;
}
```

The loading component is displayed instantly when the user navigates to `/blog`, and is replaced with the actual page content once it finishes loading.

## Simulating a Delayed Page

To demonstrate the loading state, introduce an artificial delay in the page component:

```tsx
// app/blog/page.tsx
export default async function Blog() {
  // Simulate a 2-second data fetch
  await new Promise((resolve) =>
    setTimeout(() => resolve("intentional delay"), 2000)
  );

  return (
    <div>
      <h1>Blog Page</h1>
      <p>This content loaded after 2 seconds.</p>
    </div>
  );
}
```

When you navigate to `/blog`:
1. The loading text appears immediately
2. After 2 seconds, the promise resolves
3. The loading text is replaced with the blog page content

## Loading UI Patterns

### Skeleton Loaders

Instead of plain text, use skeleton placeholders that mimic the page layout:

```tsx
// app/blog/loading.tsx
export default function BlogLoading() {
  return (
    <div className="blog-skeleton">
      <div className="skeleton-header" />
      <div className="skeleton-content">
        <div className="skeleton-line" />
        <div className="skeleton-line" />
        <div className="skeleton-line skeleton-line--short" />
      </div>
      <div className="skeleton-card" />
      <div className="skeleton-card" />
    </div>
  );
}
```

### Spinner

A simple centered spinner:

```tsx
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
      <div className="spinner" />
    </div>
  );
}
```

### Partial Loading with Suspense

For more granular control, use React Suspense directly within your page to load different sections independently:

```tsx
// app/dashboard/page.tsx
import { Suspense } from "react";
import UserProfile from "./UserProfile";
import RecentOrders from "./RecentOrders";
import Loading from "./loading";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <Suspense fallback={<div>Loading profile...</div>}>
        <UserProfile />
      </Suspense>

      <Suspense fallback={<div>Loading orders...</div>}>
        <RecentOrders />
      </Suspense>
    </div>
  );
}
```

```tsx
// app/dashboard/UserProfile.tsx
export default async function UserProfile() {
  const user = await fetchUser();
  return <div>Welcome, {user.name}</div>;
}
```

```tsx
// app/dashboard/RecentOrders.tsx
export default async function RecentOrders() {
  const orders = await fetchOrders();
  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>{order.product}</li>
      ))}
    </ul>
  );
}
```

## Nested Loading States

Loading states can be nested across route segments. Each `loading.tsx` file applies to its own segment and all nested child segments:

```
app/
  dashboard/
    loading.tsx          -- loading UI for /dashboard and below
    analytics/
      loading.tsx        -- loading UI specifically for /dashboard/analytics
      page.tsx
    settings/
      page.tsx
```

When navigating to `/dashboard/analytics`, the `dashboard/loading.tsx` may show first, followed by `dashboard/analytics/loading.tsx` for more granular feedback.

## Key Points

- `loading.tsx` automatically creates a Suspense boundary around the page and its children
- The loading UI appears **instantly** on navigation, providing immediate feedback
- Real-world implementations should use meaningful loading indicators (skeletons, spinners, shimmer effects)
- Combine `loading.tsx` with manual `<Suspense>` boundaries for fine-grained control
- Loading states can be nested at different route segment levels
- The loading component is only shown during the initial load of a page; subsequent navigations use client-side transitions
