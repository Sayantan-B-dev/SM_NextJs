# Link Component

## Overview

The `Link` component is the primary way to navigate between routes in Next.js. It extends the HTML `<a>` element and enables client-side navigation without full page reloads. Import it from `next/link`.

## Basic Usage

### Import and Implementation

```tsx
// app/page.tsx
import Link from "next/link"

export default function Home() {
  return (
    <>
      <h1>Home Page</h1>
      <Link href="/blog">Blog</Link>
      <Link href="/products">Products</Link>
    </>
  )
}
```

The `href` prop specifies the destination route. Clicking the link navigates to the target page using client-side navigation.

## Adding Navigation to Child Pages

It is good practice to include navigation back to the homepage from child pages.

```tsx
// app/products/page.tsx
import Link from "next/link"

export default function ProductList() {
  return (
    <>
      <h1>Product List</h1>
      <Link href="/">Home</Link>
    </>
  )
}
```

## Dynamic Route Links

Link to dynamic routes by constructing the `href` with route parameters.

```tsx
// app/products/page.tsx
import Link from "next/link"

const products = [
  { id: 1, name: "Product 1" },
  { id: 2, name: "Product 2" },
  { id: 3, name: "Product 3" },
]

export default function ProductList() {
  return (
    <>
      <h1>Product List</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link href={`/products/${product.id}`}>{product.name}</Link>
          </li>
        ))}
      </ul>
      <Link href="/">Home</Link>
    </>
  )
}
```

```tsx
// app/products/[productId]/page.tsx
import Link from "next/link"

export default function ProductDetails({
  params,
}: {
  params: { productId: string }
}) {
  return (
    <>
      <h1>Details about product {params.productId}</h1>
      <Link href="/products">Back to Products</Link>
      <br />
      <Link href="/">Home</Link>
    </>
  )
}
```

## Link vs Anchor Tag

| Feature | `<Link>` | `<a>` |
|---------|----------|-------|
| Navigation Type | Client-side (no full reload) | Full page reload |
| Prefetching | Automatic (in-viewport links) | None |
| Bundle Size | Includes route chunk prefetch | N/A |
| SEO | Crawler-friendly | Crawler-friendly |
| Styling | Works with className, style | Works with className, style |

## Link Component Props

| Prop | Type | Description |
|------|------|-------------|
| `href` | `string` or `object` | The destination path or URL object |
| `replace` | `boolean` | Replaces the current history entry instead of pushing |
| `scroll` | `boolean` | Controls scroll-to-top behavior (default: `true`) |
| `prefetch` | `boolean` | Controls prefetching (default: `true` for static routes) |
| `className` | `string` | CSS class name |
| `style` | `object` | Inline styles |

### Example with replace

```tsx
<Link href="/dashboard" replace>
  Dashboard (replaces current history entry)
</Link>
```

## Multiple Links in a Navigation

```tsx
// app/layout.tsx
import Link from "next/link"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/products">Products</Link>
          <Link href="/about">About</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
```

## Key Takeaways

- Always import `Link` from `next/link`, not from `next/router`
- Use `Link` for internal navigation between Next.js routes
- Use regular `<a>` tags for external links
- Links prefetch linked route data automatically when visible in the viewport
- Wrap text or elements inside `Link` to make them clickable
