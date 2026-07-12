# Parallel Routes

## Overview

Parallel routes are an advanced routing mechanism in Next.js that allows rendering multiple pages **simultaneously** within the same layout. They are defined using **slots**, which are folders prefixed with the `@` symbol. Each slot automatically becomes a prop in the corresponding `layout.tsx` file.

Parallel routes are especially useful for building complex interfaces like dashboards, where you need to display independent sections (e.g., analytics, notifications, user profile) side by side, each with its own data fetching and rendering lifecycle.

## Traditional Component Approach

Without parallel routes, a dashboard with multiple sections would look like this:

### Project Structure

```
app/
  complex-dashboard/
    layout.tsx
    page.tsx
    components/
      UserAnalytics.tsx
      RevenueMetrics.tsx
      Notifications.tsx
```

### Layout Using Components

```tsx
// app/complex-dashboard/layout.tsx
import UserAnalytics from "./components/UserAnalytics";
import RevenueMetrics from "./components/RevenueMetrics";
import Notifications from "./components/Notifications";

export default function ComplexDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>
        <UserAnalytics />
        <RevenueMetrics />
        <Notifications />
      </div>
      <main>{children}</main>
    </div>
  );
}
```

```tsx
// app/complex-dashboard/page.tsx
export default function ComplexDashboard() {
  return <h1>Complex Dashboard</h1>;
}
```

While this works, parallel routes provide additional benefits in terms of independent navigation, error handling, and loading states.

## Parallel Routes with Slots

### Project Structure with Slots

```
app/
  complex-dashboard/
    layout.tsx
    page.tsx
    @user/
      page.tsx
    @revenue/
      page.tsx
    @notifications/
      page.tsx
```

Each `@` folder defines a slot. The folder name (without `@`) becomes the prop name in the layout.

## Layout with Slot Props

```tsx
// app/complex-dashboard/layout.tsx
export default function ComplexDashboardLayout({
  children,
  user,
  revenue,
  notifications,
}: {
  children: React.ReactNode;
  user: React.ReactNode;
  revenue: React.ReactNode;
  notifications: React.ReactNode;
}) {
  return (
    <div>
      <div>
        {user}
        {revenue}
        {notifications}
      </div>
      <main>{children}</main>
    </div>
  );
}
```

Each slot is rendered as a React node, exactly like `children`. They can be placed anywhere in the layout JSX.

## Defining Slot Pages

Each slot folder has its own `page.tsx` with independent content and data fetching:

```tsx
// app/complex-dashboard/@user/page.tsx
export default async function UserAnalytics() {
  // Simulate fetching user analytics data
  const userData = await fetchUserAnalytics();

  return (
    <div className="dashboard-card">
      <h2>User Analytics</h2>
      <p>Total Users: {userData.totalUsers}</p>
      <p>Active Users: {userData.activeUsers}</p>
      <p>New Signups: {userData.newSignups}</p>
    </div>
  );
}
```

```tsx
// app/complex-dashboard/@revenue/page.tsx
export default async function RevenueMetrics() {
  const revenue = await fetchRevenueData();

  return (
    <div className="dashboard-card">
      <h2>Revenue Metrics</h2>
      <p>Monthly Revenue: ${revenue.monthly}</p>
      <p>Quarterly Revenue: ${revenue.quarterly}</p>
      <p>Annual Revenue: ${revenue.annual}</p>
    </div>
  );
}
```

```tsx
// app/complex-dashboard/@notifications/page.tsx
export default async function Notifications() {
  const notifications = await fetchNotifications();

  return (
    <div className="dashboard-card">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul>
          {notifications.map((n) => (
            <li key={n.id}>{n.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Benefits of Parallel Routes

### 1. Independent Data Fetching

Each slot fetches its own data independently. They do not block each other, leading to better performance through parallel data loading.

### 2. Independent Error Handling

Each slot can have its own `error.tsx` file, so an error in notifications does not affect the user analytics or revenue sections:

```
app/
  complex-dashboard/
    @user/
      page.tsx
    @revenue/
      page.tsx
      error.tsx        -- handles errors in revenue only
    @notifications/
      page.tsx
      error.tsx        -- handles errors in notifications only
```

### 3. Independent Loading States

Each slot can have its own `loading.tsx` file for granular loading indicators:

```
app/
  complex-dashboard/
    @user/
      page.tsx
      loading.tsx      -- skeleton for user section
    @revenue/
      page.tsx
      loading.tsx      -- skeleton for revenue section
    @notifications/
      page.tsx
      loading.tsx      -- skeleton for notifications section
```

### 4. Independent Navigation

Slots support their own navigation state, allowing sub-navigation within a slot without affecting others.

## Parallel Routes vs Layout Components

| Feature | Layout Components | Parallel Routes (Slots) |
|---------|-----------------|------------------------|
| Data fetching | Sequential within layout | Independent per slot |
| Error boundaries | Single for all components | Independent per slot |
| Loading states | Single for all components | Independent per slot |
| Navigation | Shared route state | Independent sub-navigation |
| Code organization | Components in one directory | Each slot is a route segment |
| Reusability | Easy component reuse | Less portable (tied to route) |

## Key Points

- Parallel routes are defined using `@folder` naming convention (slots)
- Each slot automatically becomes a prop in the parent layout
- Slots support independent data fetching, error handling, and loading states
- Use parallel routes for complex layouts where sections should not block each other
- Each slot can have its own `error.tsx`, `loading.tsx`, and even nested routes
- The `children` prop is an implicit slot equivalent to the main route segment
- The folder name after `@` determines the prop name in the layout
