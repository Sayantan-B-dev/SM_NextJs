# Delete Server Action

## Overview

Delete operations require calling a server action with a record ID and refreshing the displayed data after successful deletion. This tutorial covers the delete pattern using forms, the `bind` method for passing IDs, and `revalidatePath` for cache invalidation.

## Implementation

### Step 1: Server Action

```typescript
// src/actions/products.ts
"use server";

import { deleteProduct } from "@/prisma-db";
import { revalidatePath } from "next/cache";

export async function removeProduct(id: number) {
  await deleteProduct(id);
  revalidatePath("/products-db");
}
```

The server action:
1. Takes the product `id` as a parameter.
2. Calls `deleteProduct` to remove the record from the database.
3. Calls `revalidatePath` to purge the cached route data and trigger a fresh fetch.

### Step 2: Product Listing with Delete Buttons

```typescript
// app/products-db/page.tsx
import { getProducts } from "@/prisma-db";
import { removeProduct } from "@/actions/products";
import Link from "next/link";

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string | null;
};

export default async function ProductsDbPage() {
  const products: Product[] = await getProducts();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <ul className="space-y-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="p-4 border rounded-lg shadow-sm flex items-center justify-between"
          >
            <div>
              <Link
                href={`/products-db/${product.id}`}
                className="text-xl font-semibold text-blue-600 hover:underline"
              >
                {product.title}
              </Link>
              <p className="text-gray-600 mt-1">
                {product.description ?? "No description"}
              </p>
              <p className="text-lg font-bold mt-2">${product.price}</p>
            </div>
            <form action={removeProduct.bind(null, product.id)}>
              <button
                type="submit"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Why Use a Form Instead of onClick?

Using a `<form>` with `action` attribute keeps the component as a **server component**:

| Approach | Component Type | Works Without JS |
|----------|---------------|-----------------|
| `<form action={action}>` | Server component | Yes |
| `onClick={handleDelete}` | Requires client component | No |

The form wrapper is minimal and does not affect the UI layout.

## The `bind` Method for Passing ID

```typescript
<form action={removeProduct.bind(null, product.id)}>
```

`bind` creates a new function with `product.id` pre-filled as the first argument. The bound argument passes the ID to the server action without:

- Exposing it in the HTML (unlike a hidden input)
- Requiring a client component with state management

## Revalidating the Cache

```typescript
import { revalidatePath } from "next/cache";

export async function removeProduct(id: number) {
  await deleteProduct(id);
  revalidatePath("/products-db");
}
```

`revalidatePath` tells Next.js to:
1. Purge the cached data for the `/products-db` route.
2. Re-fetch the data on the next request to the page.
3. Update the UI to reflect the deletion without a manual refresh.

Without `revalidatePath`, the product list would remain stale until the page is manually refreshed.

## Complete Delete Flow

1. User clicks the "Delete" button on a product.
2. The form submits the `removeProduct` server action with the bound ID.
3. The server action calls `deleteProduct(id)` on the database.
4. `revalidatePath("/products-db")` invalidates the route cache.
5. The product listing re-renders with the updated data.
6. The deleted product disappears from the UI.

## Server Action Without Form State

Unlike create and update actions, delete actions typically do not need `useActionState` because:

- There is no form state to manage (no input fields).
- No validation messages to display.
- No previous state to track.

```typescript
export async function removeProduct(id: number) {
  await deleteProduct(id);
  revalidatePath("/products-db");
}
```

The action is a simple function that receives the ID and performs the deletion.

## Handling Simulated Latency

If your database functions have simulated delays (e.g., `await delay(1500)`), the UI will reflect a brief wait before the item disappears. In production:

- Remove artificial delays from database functions.
- Consider optimistic updates for immediate UI feedback (covered in a later tutorial).

## Summary

| Concept | Implementation |
|---------|---------------|
| Delete server action | `removeProduct(id)` in `actions/products.ts` |
| Passing the ID | `removeProduct.bind(null, product.id)` |
| Form wrapper | `<form action={...}>` around the delete button |
| Cache invalidation | `revalidatePath("/products-db")` |
| Client component needed? | No -- form keeps it as a server component |
| State management? | Not needed for simple deletes |

The delete pattern is the simplest CRUD server action: a single function receiving an ID, performing the deletion, and revalidating the path to update the UI.
