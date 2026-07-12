# File Colocation

## Overview

Next.js uses a file-system based router where each folder in the `app` directory represents a route segment that maps to a URL path. However, Next.js is flexible about how you structure your project files and folders. A route only becomes publicly accessible when you add a `page.tsx` (or `page.js`) file to it.

## How File Colocation Works

You can safely place non-page files (components, utilities, styles) inside route folders without them becoming accessible routes. Only files named `page.tsx` create publicly accessible routes.

### Example: Dashboard Route

```tsx
// app/dashboard/line-chart.tsx
export default function LineChart() {
  return <h1>Line Chart</h1>
}
```

Visiting `/dashboard` in the browser returns a **404** error because no `page.tsx` exists yet.

### Making a Route Accessible

Add a `page.tsx` file:

```tsx
// app/dashboard/page.tsx
export default function Dashboard() {
  return <h1>Dashboard</h1>
}
```

Now `/dashboard` renders "Dashboard". Only the default export from `page.tsx` is rendered.

### Non-Default Exports Are Ignored

```tsx
// app/dashboard/page.tsx
function BarChart() {
  return <h1>Bar Chart</h1>
}

export default function Dashboard() {
  return <h1>Dashboard</h1>
}
```

The `BarChart` component does not render because it is not the default export and is not used inside `Dashboard`. Only the default exported component from `page.tsx` is injected into the layout.

## Reserved File Names

Next.js reserves specific filenames that create special behavior. All other files are treated as colocated and ignored for routing.

| File Name | Purpose |
|-----------|---------|
| `page.tsx` | Defines a route's UI |
| `layout.tsx` | Defines shared layout for a segment |
| `loading.tsx` | Defines loading UI |
| `error.tsx` | Defines error UI |
| `not-found.tsx` | Defines 404 UI |
| `route.tsx` | Defines API route handlers |
| `template.tsx` | Defines re-rendering layout |
| `default.tsx` | Defines fallback for parallel routes |

Any other file (e.g., `button.tsx`, `styles.module.css`, `utils.ts`) is safely ignored.

## Project Structure Options

### Files Inside the App Directory

```
app/
  dashboard/
    page.tsx          // Public route at /dashboard
    line-chart.tsx    // Colocated component, not a route
    bar-chart.tsx     // Colocated component, not a route
    chart-styles.css  // Colocated stylesheet
```

### Files Outside the App Directory

Many developers prefer keeping shared components, utilities, and business logic outside `app/`:

```
src/
  components/
    header.tsx
    footer.tsx
    line-chart.tsx
  lib/
    utils.ts
    api-client.ts
  hooks/
    use-auth.ts
    use-fetch.ts
app/
  dashboard/
    page.tsx
  layout.tsx
  page.tsx
```

This separation keeps routing concerns distinct from application logic and is considered a best practice for larger projects.

## Importing Colocated Files

Colocated files can be imported normally using relative imports:

```tsx
// app/dashboard/page.tsx
import { LineChart } from "./line-chart"
import { BarChart } from "./bar-chart"

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <LineChart />
      <BarChart />
    </div>
  )
}
```

Even though `LineChart` and `BarChart` are in the same route folder, they only render when explicitly imported and used by the page component.

## Organizing by Feature

File colocation encourages organizing code by feature rather than by type:

```
app/
  dashboard/
    page.tsx
    dashboard-header.tsx
    dashboard-sidebar.tsx
    revenue-chart.tsx
    customer-table.tsx
    dashboard-utils.ts
  products/
    page.tsx
    product-card.tsx
    product-grid.tsx
    product-utils.ts
```

Each feature folder contains everything it needs, making the codebase easier to navigate and maintain.

## Benefits of File Colocation

| Benefit | Description |
|---------|-------------|
| Proximity | Related files stay close to where they are used |
| Maintainability | Easy to see all files related to a route |
| Refactoring | Moving a route folder moves all its related files |
| No Accidental Routes | Only reserved filenames become routes |
| Flexibility | Choose your own organizational pattern |

## Practical Example: Blog Feature

```
app/
  blog/
    page.tsx              // Blog index (list of posts)
    blog-card.tsx         // Card component for each post
    blog-sidebar.tsx      // Sidebar with categories
    blog-utils.ts         // Helper functions
    [slug]/
      page.tsx            // Individual blog post
      related-posts.tsx   // Related posts component
      comments.tsx        // Comments section
```

All component and utility files coexist peacefully alongside routing files without creating unintended routes.

## Key Takeaway

| Location | Behavior |
|----------|----------|
| `app/dashboard/page.tsx` | Creates accessible route at `/dashboard` |
| `app/dashboard/line-chart.tsx` | Colocated file, not a route |
| `app/dashboard/bar-chart.tsx` | Colocated file, not a route |
| `app/dashboard/styles.css` | Colocated file, not a route |
| `src/components/header.tsx` | Outside app, purely organizational |

You can freely colocate project files inside route segments without worrying about them accidentally becoming routes. Only the reserved filenames (page, layout, loading, error, etc.) create special routing behavior.
