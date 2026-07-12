# Creating Routes & Navigation in Next.js 15

## Introduction to File-Based Routing

Next.js uses a **file-based routing system** where the structure of the `app/` directory directly maps to URL paths. Each folder represents a route segment, and the `page.tsx` file inside that folder defines the UI for that route.

**How it works:**
- `app/page.tsx` maps to `/`
- `app/about/page.tsx` maps to `/about`
- `app/blog/page.tsx` maps to `/blog`
- `app/blog/[id]/page.tsx` maps to `/blog/1`, `/blog/hello-world`, etc.

---

## Creating Basic Routes

```
app/
  page.tsx            -> / (Home)
  about/
    page.tsx          -> /about
  contact/
    page.tsx          -> /contact
  blog/
    page.tsx          -> /blog
    [slug]/
      page.tsx        -> /blog/hello-world (dynamic route)
```

### Home Page (`app/page.tsx`)

```tsx
export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to our website.</p>
    </div>
  );
}
```

### About Page (`app/about/page.tsx`)

```tsx
export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Learn more about our company and mission.</p>
    </div>
  );
}
```

### Contact Page (`app/contact/page.tsx`)

```tsx
export default function ContactPage() {
  return (
    <div>
      <h1>Contact</h1>
      <p>Get in touch with us.</p>
    </div>
  );
}
```

---

## The Link Component (`next/link`)

The `Link` component is the primary way to navigate between pages in Next.js. It extends the HTML `<a>` element with client-side navigation capabilities.

### Why Use Link Instead of `<a>`?

| Feature | `<a>` (anchor tag) | `<Link>` (next/link) |
|---|---|---|
| Full page reload | Yes | No |
| Client-side navigation | No | Yes |
| Prefetching | No | Yes (by default) |
| Scroll to top | Always | Configurable |
| Works with routing | No | Yes |

A regular `<a>` tag triggers a full browser navigation, losing React state and causing a slower experience. `Link` performs client-side transitions, updating only the content that changed.

### Basic Usage

```tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
}
```

### Link Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | `string` or `UrlObject` | Required | The destination path |
| `replace` | `boolean` | `false` | Replace current history entry instead of pushing |
| `scroll` | `boolean` | `true` | Scroll to top after navigation |
| `prefetch` | `boolean` | `true` | Prefetch the linked page in the background |
| `className` | `string` | -- | CSS class for styling |
| `style` | `object` | -- | Inline styles |

### Prefetching

By default, `Link` components prefetch linked pages when they enter the viewport. This makes navigation feel instant because the page data is already loaded.

```tsx
// Disable prefetch for rarely-visited links
<Link href="/archive" prefetch={false}>Archive</Link>
```

---

## Shared Layouts with the Root Layout

The root layout (`app/layout.tsx`) wraps all routes. Adding a navbar here makes it appear on every page.

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Website",
  description: "A multi-page Next.js application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <main>{children}</main>
        <footer>
          <p>&copy; 2025 My Website</p>
        </footer>
      </body>
    </html>
  );
}
```

**Key insight:** The `{children}` is replaced with the currently active page. Everything else (`<nav>`, `<footer>`) remains consistent across navigations.

---

## Active Link Styling

To highlight the currently active link, use the `usePathname()` hook from `next/navigation`. This requires a Client Component.

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          style={{
            fontWeight: pathname === link.href ? "bold" : "normal",
            color: pathname === link.href ? "#0070f3" : "#000",
          }}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
```

---

## Nested Routes

Creating folder hierarchies gives you deeply nested routes.

```
app/
  products/
    page.tsx            -> /products
    categories/
      page.tsx          -> /products/categories
      [category]/
        page.tsx        -> /products/categories/electronics
```

```tsx
// app/products/page.tsx
export default function ProductsPage() {
  return <h1>All Products</h1>;
}

// app/products/categories/page.tsx
export default function CategoriesPage() {
  return <h1>Product Categories</h1>;
}

// app/products/categories/[category]/page.tsx
export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  return <h1>Category: {params.category}</h1>;
}
```

---

## Navigation Between Pages -- Complete Example

Here is a complete multi-page application with a shared navbar.

### `app/layout.tsx`

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "My App",
  description: "A complete multi-page app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav style={{ background: "#333", padding: "1rem", display: "flex", gap: "1rem" }}>
          <Link href="/" style={{ color: "white", textDecoration: "none" }}>Home</Link>
          <Link href="/about" style={{ color: "white", textDecoration: "none" }}>About</Link>
          <Link href="/contact" style={{ color: "white", textDecoration: "none" }}>Contact</Link>
        </nav>
        <main style={{ padding: "2rem" }}>{children}</main>
      </body>
    </html>
  );
}
```

### `app/page.tsx`

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to our multi-page Next.js application.</p>
      <Link href="/about">Learn more about us</Link>
    </div>
  );
}
```

### `app/about/page.tsx`

```tsx
export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>We build modern web applications with Next.js.</p>
    </div>
  );
}
```

### `app/contact/page.tsx`

```tsx
export default function ContactPage() {
  return (
    <div>
      <h1>Contact</h1>
      <p>Email us at hello@example.com</p>
    </div>
  );
}
```

---

## Summary

| Concept | Details |
|---|---|
| File-based routing | Folder structure = URL structure |
| `page.tsx` | Required file that creates a route |
| `Link` component | Client-side navigation, prefetching |
| Root Layout | Shared wrapper with persistent UI |
| `usePathname()` | Hook for active link detection |
| Nested routes | Subfolders for deeper paths |
