# Dynamic Routes

While nested routes work for predefined paths, real applications need to handle variable URL segments. Dynamic routes solve this problem using folder names in square brackets.

## Scenario 4: Product Listing and Details

We need:
- `/products` -- List all products
- `/products/1` -- Details for product 1
- `/products/2` -- Details for product 2
- `/products/100` -- Details for product 100

### The Wrong Approach (Hardcoded Folders)

Creating individual folders (`1/`, `2/`, `3/`) does not scale for hundreds or thousands of products.

### The Right Approach (Dynamic Segments)

Use square brackets in the folder name:

```
src/
  app/
    products/
      page.tsx
      [productId]/
        page.tsx
```

### Product Listing Page

```typescript
// src/app/products/page.tsx
export default function ProductList() {
  return (
    <div>
      <h1>Product List</h1>
      <h2>Product 1</h2>
      <h2>Product 2</h2>
      <h2>Product 3</h2>
    </div>
  );
}
```

### Product Details Page (Dynamic)

```typescript
// src/app/products/[productId]/page.tsx
export default async function ProductDetails({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  return <h1>Details about product {productId}</h1>;
}
```

The folder name `[productId]` tells Next.js to treat this segment as a dynamic value.

## How It Works

| URL | Matches | `productId` Value |
|-----|---------|-------------------|
| `/products` | `products/page.tsx` | N/A |
| `/products/1` | `products/[productId]/page.tsx` | `"1"` |
| `/products/abc` | `products/[productId]/page.tsx` | `"abc"` |
| `/products/100` | `products/[productId]/page.tsx` | `"100"` |

## Accessing Route Parameters

Every page in the App Router receives route parameters through the `params` prop:

```typescript
// Type signature
params: Promise<{ [dynamicSegment: string]: string }>
```

- `params` is a **Promise** that resolves to an object containing dynamic segments as key-value pairs
- The key name matches the folder name inside square brackets (e.g., `[productId]` becomes `productId`)
- Use `async/await` to resolve the promise (works in Server Components)

## Benefits of Dynamic Routes

- Scales to any number of products, posts, or resources
- No need to create individual files for each item
- Route parameters are accessible in the component for data fetching
- Works with both numeric and string identifiers

## Visual Structure

```
app/
  page.tsx                          ->  /
  products/
    page.tsx                        ->  /products
    [productId]/
      page.tsx                      ->  /products/:productId
```

Dynamic routes are essential for building list-detail views, e-commerce catalogs, blogs, and any application with variable URL segments.
