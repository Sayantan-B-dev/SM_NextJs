# Private Folders

## Overview

Private folders in Next.js allow you to exclude a folder and all its subfolders from the routing system. This helps keep your project organized by separating internal implementation files from publicly accessible routes. To create a private folder, prefix the folder name with an underscore (`_`).

## Creating a Private Folder

```
app/
  _lib/
    format-date.ts      // Internal utility, not a route
    api-helpers.ts      // Internal utility, not a route
  dashboard/
    page.tsx            // Public route at /dashboard
```

### Example: Private Folder with Page File

```tsx
// app/_lib/page.tsx
export default function PrivateRoute() {
  return <h1>You cannot view this in the browser</h1>
}
```

Despite having a `page.tsx`, navigating to `http://localhost:3000/_lib` returns a **404** error. The underscore prefix tells Next.js to exclude the folder from routing entirely.

## Use Cases for Private Folders

| Use Case | Description |
|----------|-------------|
| UI Logic Separation | Keep UI components separate from routing logic |
| Internal Utilities | Store helper functions, API clients, configuration files |
| Code Organization | Group related files together in the code editor |
| Naming Convention Safety | Avoid potential conflicts with future Next.js reserved filenames |

## Practical Example: Full Project Structure

```
app/
  _components/
    header.tsx
    footer.tsx
    nav-bar.tsx
    sidebar.tsx
    theme-toggle.tsx
  _lib/
    format-date.ts
    validate-email.ts
    api-client.ts
    constants.ts
  _hooks/
    use-auth.ts
    use-fetch.ts
    use-local-storage.ts
  _styles/
    globals.css
    variables.css
  dashboard/
    page.tsx
  about/
    page.tsx
  blog/
    page.tsx
```

All files in `_components`, `_lib`, `_hooks`, and `_styles` are excluded from routing. They can be imported and used by any public route.

## Importing from Private Folders

Other files in the `app` directory can import from private folders using relative paths:

```tsx
// app/dashboard/page.tsx
import Header from "../_components/header"
import { formatDate } from "../_lib/format-date"
import { useAuth } from "../_hooks/use-auth"

export default function Dashboard() {
  const { user } = useAuth()
  return (
    <div>
      <Header />
      <h1>Dashboard</h1>
      <p>Last login: {formatDate(user.lastLogin)}</p>
    </div>
  )
}
```

## Private Folder vs Regular Folder

| Aspect | Private Folder (`_folder`) | Regular Folder (`folder`) |
|--------|---------------------------|---------------------------|
| Routing | Excluded from routing | Included in routing |
| URL Access | Returns 404 | Accessible if contains `page.tsx` |
| Naming Convention | Starts with underscore | Any name without underscore |
| Subfolder Behavior | Entire subtree excluded | Subfolder routing depends on content |

## Nesting Private Folders

Private folders can be nested to create deeper organizational structures:

```
app/
  _shared/
    _components/
      button.tsx
      card.tsx
    _utils/
      helpers.ts
      validators.ts
  _features/
    _auth/
      auth-service.ts
      auth-types.ts
    _dashboard/
      dashboard-service.ts
      dashboard-types.ts
```

All folders starting with `_` are excluded from routing, regardless of nesting depth.

## Pro Tip: Underscore in URLs

If you genuinely need an underscore in your URL path, use the URL-encoded equivalent `%5F` instead:

| URL | Result |
|-----|--------|
| `http://localhost:3000/_lib` | 404 (private folder) |
| `http://localhost:3000/%5Flib` | Routes to `_lib` folder if it exists without underscore prefix |

This only works if the folder is not literally named with an underscore prefix. A folder named `_lib` (starting with underscore) is always treated as private.

## Private Folders vs File Colocation

| Feature | File Colocation | Private Folders |
|---------|----------------|-----------------|
| Mechanism | Files coexist in route folders | Folder name starts with `_` |
| Visibility | Non-page files are ignored for routing | Entire folder is excluded from routing |
| Scope | Individual files | Folder and all subfolders |
| Best For | Small components alongside routes | Larger internal modules and utilities |
| Organization | Feature-based grouping | Concern-based grouping |

## When to Use Private Folders

- **Internal libraries**: Utility functions, API helpers, type definitions
- **Shared components**: UI primitives used across multiple routes
- **Custom hooks**: React hooks that manage state or side effects
- **Configuration**: Constants, environment helpers, static data
- **Styles**: CSS modules, design tokens, theme variables

Private folders complement file colocation by giving you an explicit way to mark entire directory trees as internal-only, making your project structure clearer and more maintainable.
