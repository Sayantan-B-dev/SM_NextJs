# Navigating Programmatically

## Overview

While the `<Link>` component handles most navigation needs, certain scenarios require programmatic navigation. Common examples include:

- Redirecting after form submission (e.g., order confirmation page)
- Navigating after authentication
- Conditional routing based on user actions
- Time-based or event-driven redirects

Next.js provides the `useRouter` hook from `next/navigation` to handle programmatic navigation in client components.

## Project Structure

```
app/
  order-product/
    page.tsx
  page.tsx
```

## Basic Programmatic Navigation

Create an order product page with a button that navigates to the homepage after processing an order:

```tsx
// app/order-product/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function OrderProduct() {
  const router = useRouter();

  const handleClick = () => {
    console.log("Placing your order...");
    router.push("/");
  };

  return (
    <>
      <h1>Order Product</h1>
      <button onClick={handleClick}>Place Order</button>
    </>
  );
}
```

### Important: Client Component Requirement

The `useRouter` hook only works in **client components**. The `"use client"` directive must be added at the top of the file. Without it, you will see a runtime error.

## useRouter Methods

The `useRouter` hook provides several methods for navigation:

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function NavigationExample() {
  const router = useRouter();

  return (
    <div>
      {/* Navigate to a new page (adds to history stack) */}
      <button onClick={() => router.push("/dashboard")}>
        Go to Dashboard
      </button>

      {/* Navigate to a new page (replaces current history entry) */}
      <button onClick={() => router.replace("/dashboard")}>
        Replace with Dashboard
      </button>

      {/* Navigate back in history */}
      <button onClick={() => router.back()}>Go Back</button>

      {/* Navigate forward in history */}
      <button onClick={() => router.forward()}>Go Forward</button>

      {/* Refresh the current page */}
      <button onClick={() => router.refresh()}>Refresh</button>

      {/* Prefetch a route for faster navigation */}
      <button
        onMouseEnter={() => router.prefetch("/dashboard")}
        onClick={() => router.push("/dashboard")}
      >
        Dashboard (prefetched)
      </button>
    </div>
  );
}
```

### Method Reference

| Method | Description |
|--------|-------------|
| `push(path)` | Navigates to the specified path, adding a new entry to the browser history stack |
| `replace(path)` | Navigates to the specified path, replacing the current entry in the history stack |
| `back()` | Navigates to the previous entry in the history stack |
| `forward()` | Navigates to the next entry in the history stack |
| `refresh()` | Refreshes the current page without affecting history |
| `prefetch(path)` | Prefetches the specified route for faster client-side transitions |

## Navigation with Dynamic Routes

Programmatic navigation works with all route patterns, including dynamic, nested, and catch-all routes:

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function ProductList() {
  const router = useRouter();

  const products = [
    { id: "p1", name: "Laptop" },
    { id: "p2", name: "Phone" },
    { id: "p3", name: "Tablet" },
  ];

  const viewProduct = (id: string) => {
    router.push(`/products/${id}`);
  };

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name}
            <button onClick={() => viewProduct(product.id)}>
              View Details
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Navigation with Query Parameters

You can include query parameters when navigating programmatically:

```tsx
router.push("/products?category=electronics&sort=price_asc");
router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
```

## useRouter vs Link Component

| Feature | `<Link>` | `useRouter` |
|---------|----------|-------------|
| Use case | Standard navigation (links, menus) | Event-driven navigation (form submit, auth redirect) |
| Component type | Works in server and client | Client component only |
| Prefetching | Automatic (by default) | Manual via `prefetch()` |
| History control | Default push behavior | `push()`, `replace()`, `back()`, `forward()` |
| Accessibility | Built-in anchor element | Must be attached to interactive elements |
| SEO | Crawlable links | Not crawlable by default |

## Best Practices

- Use `<Link>` for standard navigation elements like menus, navigation bars, and content links
- Use `useRouter` for side-effect-driven navigation after form submissions, API calls, or authentication
- Always add `"use client"` directive when using `useRouter`
- Use `router.replace()` instead of `router.push()` to prevent users from navigating back to pages that should not be revisited (e.g., after logout)
- Consider using `router.prefetch()` on hover or focus events for performance optimization
