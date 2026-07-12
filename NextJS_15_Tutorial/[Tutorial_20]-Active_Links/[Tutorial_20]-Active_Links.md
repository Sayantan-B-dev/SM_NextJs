# Active Links

## Overview

Styling the currently active link in a navigation menu helps users understand where they are in your application. Next.js provides the `usePathname` hook from `next/navigation` to get the current URL path, which you can compare against link hrefs to determine the active state.

## Initial Setup

Create a navigation layout with a list of links:

```tsx
// app/(auth)/layout.tsx
import Link from "next/link"

const navLinks = [
  { name: "Register", href: "/register" },
  { name: "Login", href: "/login" },
  { name: "Forgot Password", href: "/forgot-password" },
]

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <nav>
        {navLinks.map((link) => (
          <Link key={link.name} href={link.href}>
            {link.name}
          </Link>
        ))}
      </nav>
      {children}
    </>
  )
}
```

This renders a navigation bar on all auth pages (`/register`, `/login`, `/forgot-password`).

## Adding Active Link Detection

### Step 1: Use the `useClient` Directive

The `usePathname` hook is a React hook and only works in client components.

```tsx
// app/(auth)/layout.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
```

### Step 2: Get the Current Pathname

```tsx
const pathname = usePathname()
```

### Step 3: Determine Active State

```tsx
{navLinks.map((link) => {
  const isActive = pathname === link.href
  return (
    <Link
      key={link.name}
      href={link.href}
      className={isActive ? "font-bold text-blue-600" : "text-gray-500"}
    >
      {link.name}
    </Link>
  )
})}
```

## Complete Implementation

```tsx
// app/(auth)/layout.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navLinks = [
  { name: "Register", href: "/register" },
  { name: "Login", href: "/login" },
  { name: "Forgot Password", href: "/forgot-password" },
]

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <>
      <nav>
        {navLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.name}
              href={link.href}
              style={{
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? "#2563eb" : "#6b7280",
                marginRight: "1rem",
                textDecoration: isActive ? "underline" : "none",
              }}
            >
              {link.name}
            </Link>
          )
        })}
      </nav>
      {children}
    </>
  )
}
```

## Handling the Root Route

When dealing with the root route (`/`), an exact match check (`pathname === href`) works correctly. However, for nested routes, you may need `startsWith`:

```tsx
const isActive = pathname === link.href ||
  (pathname.startsWith(link.href) && link.href !== "/")
```

This ensures that `/blog/my-post` matches a `/blog` nav link, while `/` does not match everything.

## Active Link with CSS Classes

```tsx
// Using Tailwind CSS classes
<Link
  key={link.name}
  href={link.href}
  className={`px-4 py-2 rounded-md transition-colors ${
    isActive
      ? "bg-blue-500 text-white"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  }`}
>
  {link.name}
</Link>
```

## The `usePathname` Hook

| Property | Description |
|----------|-------------|
| Returns | The current URL pathname as a string |
| Example | `/register`, `/login`, `/products/1` |
| Client Only | Requires `"use client"` directive |
| Import | `from "next/navigation"` |

## Key Points

| Point | Description |
|-------|-------------|
| Client Component | Components using `usePathname` must be client components |
| Exact Match | Use `pathname === href` for exact route matching |
| Partial Match | Use `pathname.startsWith(href)` for nested route sections |
| Root Route Caution | Exclude root (`/`) from `startsWith` to avoid matching all routes |
| Dynamic Styling | Apply conditional styles based on the `isActive` boolean |

## Alternative: useSelectedLayoutSegment

For more granular active link detection in layouts, you can use `useSelectedLayoutSegment` which returns the currently active segment:

```tsx
"use client"

import { useSelectedLayoutSegment } from "next/navigation"

export default function NavLink({ href, children }: {
  href: string
  children: React.ReactNode
}) {
  const segment = useSelectedLayoutSegment()
  const isActive = `/${segment}` === href

  return (
    <Link href={href} className={isActive ? "active" : ""}>
      {children}
    </Link>
  )
}
```

This approach is useful for layouts where you want to detect the active child segment without accessing the full pathname.
