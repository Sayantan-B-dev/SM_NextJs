# Multiple Root Layouts

## Overview

The root layout in `app/layout.tsx` applies to every page in your application. But what if you need different layouts for different sections? For example, marketing pages need a header and footer, while authentication pages should be minimal. Route groups solve this by allowing multiple root-level layouts.

## The Problem

Consider an app with these routes:

```
app/
  revenue/
    page.tsx
  customers/
    page.tsx
  login/
    page.tsx
  register/
    page.tsx
```

Adding a header and footer to `app/layout.tsx` applies them to every page, including login and register where you might want a clean, minimal design.

## The Solution: Route Groups with Custom Layouts

Use route groups to apply different layouts to different sections.

### Step 1: Create Route Groups

```
app/
  (marketing)/
    revenue/
      page.tsx
    customers/
      page.tsx
  (auth)/
    login/
      page.tsx
    register/
      page.tsx
```

### Step 2: Add Layouts to Each Route Group

Move the root layout into the `(marketing)` group and create a separate layout for `(auth)`.

```tsx
// app/(marketing)/layout.tsx
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header>Marketing Header</header>
        <main>{children}</main>
        <footer>Marketing Footer</footer>
      </body>
    </html>
  )
}
```

```tsx
// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <footer>Auth Footer</footer>
      </body>
    </html>
  )
}
```

### Step 3: Remove the Root Layout

The `app/layout.tsx` file must be deleted. A route group with a layout acts as the root layout for all routes within that group.

### Step 4: Move page.tsx

The root `app/page.tsx` (serving `/`) must be moved into the appropriate route group:

```
app/
  (marketing)/
    page.tsx           // Now serves the home page at /
    revenue/
      page.tsx
    customers/
      page.tsx
  (auth)/
    login/
      page.tsx
    register/
      page.tsx
```

## How It Resolves

When a request comes in:

1. Next.js checks which route group the URL belongs to
2. It uses that route group's layout as the root layout
3. Routes not in any explicit route group need a root layout in the `app` directory

| URL | Route Group | Layout Used |
|-----|-------------|-------------|
| `/` | `(marketing)` | MarketingLayout (header + footer) |
| `/revenue` | `(marketing)` | MarketingLayout (header + footer) |
| `/customers` | `(marketing)` | MarketingLayout (header + footer) |
| `/login` | `(auth)` | AuthLayout (minimal, footer only) |
| `/register` | `(auth)` | AuthLayout (minimal, footer only) |

## Important Rules

| Rule | Description |
|------|-------------|
| No Root Layout | The `app/layout.tsx` file must not exist when using multiple root layouts |
| HTML/body Tags | Each route group layout must include `<html>` and `<body>` tags |
| Exclusive Groups | A route can only belong to one route group |
| Complete Coverage | Every route must be inside a route group that has a layout, or the `app` directory must have a root layout |

## Practical Use Case

```
app/
  (public)/
    layout.tsx            // Public layout with marketing header/footer
    page.tsx              // Home page
    about/
      page.tsx
    blog/
      page.tsx
  (auth)/
    layout.tsx            // Minimal auth layout
    login/
      page.tsx
    register/
      page.tsx
    forgot-password/
      page.tsx
  (dashboard)/
    layout.tsx            // Dashboard layout with sidebar
    dashboard/
      page.tsx
    settings/
      page.tsx
```

Each section gets its own layout while sharing nothing at the root level, giving you full control over the HTML structure per section.
