# Templates

## Overview

Templates are a special file type in the Next.js App Router, similar to layouts, but with one key difference: **templates create a new instance for each child component on every navigation**, whereas layouts preserve state across navigations.

This behavior makes templates the right choice when you need:
- Enter or exit animations on route changes
- `useEffect` to re-run on every navigation
- Fresh state for each route child
- Resetting component state between pages

## Layouts vs Templates

### Layout Behavior

Layouts wrap page content and **preserve state** across navigations. Shared elements like headers, sidebars, and input values remain intact.

```tsx
// app/auth/layout.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [input, setInput] = useState("");

  return (
    <div>
      <nav>
        <Link href="/auth/register">Register</Link>
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/forgot-password">Forgot Password</Link>
      </nav>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type something..."
      />

      <main>{children}</main>
    </div>
  );
}
```

When navigating between Register, Login, and Forgot Password:
- The `children` (page content) **remounts and re-renders**
- The layout component (including the input state) **does not remount** -- the typed value persists
- This is efficient because shared UI elements are not recreated

### Template Behavior

Templates also wrap page content but **remount on every navigation**, creating fresh instances:

```tsx
// app/auth/template.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function AuthTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [input, setInput] = useState("");

  return (
    <div>
      <nav>
        <Link href="/auth/register">Register</Link>
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/forgot-password">Forgot Password</Link>
      </nav>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type something..."
      />

      <main>{children}</main>
    </div>
  );
}
```

When navigating between routes:
- Both the `children` and the template **remount on every navigation**
- The input state **resets** with each route change
- Any `useEffect` hooks inside the template **re-run**

## Practical Example: Animations with Templates

Templates are ideal for implementing page transition animations:

```tsx
// app/(marketing)/template.tsx
"use client";

import { motion } from "framer-motion";

export default function MarketingTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

Since the template remounts on every navigation, the animation triggers each time the user visits a new page under this route segment.

## Practical Example: Analytics Tracking

Use templates when you need to track page views on every navigation:

```tsx
// app/blog/template.tsx
"use client";

import { useEffect } from "react";

export default function BlogTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // This runs on every page navigation within /blog
    console.log("Page view tracked:", window.location.pathname);
    // Send analytics event
    // analytics.pageView(window.location.pathname);
  }, []);

  return <div>{children}</div>;
}
```

With a layout, this `useEffect` would only run once on initial load. With a template, it runs on every route change.

## When to Use Templates vs Layouts

| Scenario | Use Layout | Use Template |
|----------|-----------|-------------|
| Persistent navigation, sidebar, header | Yes | No |
| Preserving form or UI state across pages | Yes | No |
| Performance-critical shared UI | Yes | No |
| Page transition animations | No | Yes |
| Analytics tracking per page view | No | Yes |
| useEffect that must re-run on navigation | No | Yes |
| Resetting scroll position per page | No | Yes |
| Authentication guards that re-check on navigation | No | Yes |

## Project Structure

```
app/
  auth/
    layout.tsx  (or template.tsx)
    register/
      page.tsx
    login/
      page.tsx
    forgot-password/
      page.tsx
```

## Key Points

- Use `template.tsx` instead of `layout.tsx` when you need a fresh component instance on each navigation
- Templates support the same API surface as layouts (`children` prop)
- Templates remount on every navigation; layouts persist
- Templates are useful for animations, analytics, and any behavior requiring re-initialization
