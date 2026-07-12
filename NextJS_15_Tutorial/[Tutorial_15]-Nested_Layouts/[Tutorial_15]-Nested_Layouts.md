# Nested Layouts

## Overview

Layouts in Next.js can be nested. While the root layout wraps your entire application, you can create additional layouts for specific route segments. This allows different sections of your app to have their own layout structure while still inheriting the root layout.

## How Nested Layouts Work

When you add a `layout.tsx` inside a route folder, it becomes a nested layout. The rendering flow is:

1. Root layout renders
2. Root layout's `children` is replaced by the nested layout
3. Nested layout's `children` is replaced by the actual page content

## Example: Product Details Layout

### Project Structure

```
app/
  layout.tsx                    // Root layout (header + footer)
  products/
    layout.tsx                  // Nested layout (featured products)
    page.tsx                    // Product list
    [productId]/
      page.tsx                  // Individual product details
```

### Root Layout

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header>Header</header>
        <main>{children}</main>
        <footer>Footer</footer>
      </body>
    </html>
  )
}
```

### Nested Layout for Products

```tsx
// app/products/layout.tsx
export default function ProductDetailsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      <h2>Featured Products</h2>
      {children}
    </section>
  )
}
```

### Product List Page

```tsx
// app/products/page.tsx
export default function ProductList() {
  return (
    <ul>
      <li>Product 1</li>
      <li>Product 2</li>
      <li>Product 3</li>
    </ul>
  )
}
```

### Dynamic Product Page

```tsx
// app/products/[productId]/page.tsx
export default function ProductDetails({
  params,
}: {
  params: { productId: string }
}) {
  return <h1>Details about product {params.productId}</h1>
}
```

## Rendering Behavior

| URL | What Renders |
|-----|-------------|
| `/` | Root layout > Header + Footer + Home page |
| `/products` | Root layout > Header + Footer + Product list |
| `/products/1` | Root layout > Header + Footer + Featured Products + Product detail |
| `/products/2` | Root layout > Header + Footer + Featured Products + Product detail |

### Visual Hierarchy for `/products/1`

```
<html>
  <body>
    <header>Header</header>
    <main>
      <!-- From root layout's children -->
      <section>
        <!-- From products/layout.tsx -->
        <h2>Featured Products</h2>
        <!-- From products/[productId]/page.tsx -->
        <h1>Details about product 1</h1>
      </section>
    </main>
    <footer>Footer</footer>
  </body>
</html>
```

## Benefits of Nested Layouts

| Benefit | Description |
|---------|-------------|
| Specialized UI | Different sections get tailored layouts |
| Code Reuse | Shared structure defined once per segment |
| State Persistence | Nested layouts persist during navigation within the same segment |
| Separation of Concerns | Each layout manages its own scope |

## Practical Use Cases

### Blog Section

```
app/
  layout.tsx                    // Global layout
  blog/
    layout.tsx                  // Blog sidebar with categories
    [slug]/
      page.tsx                  // Blog post
    page.tsx                    // Blog index
```

### Admin Section

```
app/
  layout.tsx                    // Global layout
  admin/
    layout.tsx                  // Admin sidebar + auth check
    dashboard/
      page.tsx
    users/
      page.tsx
    settings/
      page.tsx
```

Nested layouts give you granular control over UI structure at every level of your route hierarchy.
