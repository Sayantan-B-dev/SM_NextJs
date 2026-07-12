# Update Server Action

## Overview

Implementing an update operation requires fetching existing data to populate a form, then submitting changes via a server action. This tutorial covers passing additional arguments (like an ID) to server actions using the `bind` method.

## Project Structure

```
app/
  products-db/
    [id]/
      page.tsx           # Server component for data fetching
      product-edit-form.tsx  # Client component for form
    page.tsx             # Product listing with links
src/
  actions/
    products.ts          # Server actions (createProduct, editProduct)
  prisma-db.ts           # Database functions
```

## Step 1: Create the Dynamic Route

```
app/products-db/[id]/page.tsx
app/products-db/[id]/product-edit-form.tsx
```

## Step 2: Server Component for Data Fetching

Server components can be `async`, but client components cannot. Split the logic: use a server component for data fetching and pass data as props to a client form component.

```typescript
// app/products-db/[id]/page.tsx
import { getProduct } from "@/prisma-db";
import { notFound } from "next/navigation";
import { Product } from "@/app/products-db/page";
import { EditProductForm } from "./product-edit-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product: Product | null = await getProduct(parseInt(id));

  if (!product) {
    notFound();
  }

  return <EditProductForm product={product} />;
}
```

## Step 3: Client Form Component with Default Values

```typescript
// app/products-db/[id]/product-edit-form.tsx
"use client";

import { useActionState } from "react";
import { editProduct, FormState } from "@/actions/products";
import { Product } from "@/app/products-db/page";

const initialState: FormState = {
  errors: {},
};

type Props = {
  product: Product;
};

export function EditProductForm({ product }: Props) {
  // Bind the product ID as an additional argument
  const editProductWithId = editProduct.bind(null, product.id);
  const [state, formAction, isPending] = useActionState(
    editProductWithId,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4 p-8">
      <div>
        <label htmlFor="title" className="block mb-1">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={product.title}
          className="border p-2 w-full"
        />
        {state.errors.title && (
          <p className="text-red-500 text-sm mt-1">{state.errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="price" className="block mb-1">Price</label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          defaultValue={product.price}
          className="border p-2 w-full"
        />
        {state.errors.price && (
          <p className="text-red-500 text-sm mt-1">{state.errors.price}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block mb-1">Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={product.description ?? ""}
          className="border p-2 w-full"
        />
        {state.errors.description && (
          <p className="text-red-500 text-sm mt-1">{state.errors.description}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
```

## Step 4: Server Action with Bound ID

```typescript
// src/actions/products.ts
"use server";

import { addProduct, updateProduct } from "@/prisma-db";
import { redirect } from "next/navigation";

export type Errors = {
  title?: string;
  price?: string;
  description?: string;
};

export type FormState = {
  errors: Errors;
};

// Create action (no extra argument)
export async function createProduct(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // ... validation and creation logic ...
}

// Update action (receives bound ID as first argument)
export async function editProduct(
  id: number,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const title = formData.get("title") as string;
  const price = formData.get("price") as string;
  const description = formData.get("description") as string;

  const errors: Errors = {};

  if (!title) errors.title = "Title is required";
  if (!price) errors.price = "Price is required";
  if (!description) errors.description = "Description is required";

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  await updateProduct(id, {
    title,
    price: parseFloat(price),
    description,
  });

  redirect("/products-db");
}
```

## The `bind` Method for Additional Arguments

Server actions receive `prevState` and `formData` automatically. To pass additional arguments (like `id`), use JavaScript's `Function.prototype.bind`:

```typescript
const editProductWithId = editProduct.bind(null, product.id);
```

This creates a new function where `product.id` is pre-filled as the first argument. The argument order becomes:

1. `id` (bound argument)
2. `prevState` (from useActionState)
3. `formData` (from form submission)

### Alternative: Hidden Input Field

A less secure alternative is using a hidden input:

```html
<input type="hidden" name="id" value={product.id} />
```

The `bind` approach is preferred because the ID never appears in the HTML source.

## Step 5: Add Navigation Links

```typescript
// app/products-db/page.tsx
import Link from "next/link";

// In the JSX:
<Link
  href={`/products-db/${product.id}`}
  className="text-blue-600 hover:underline"
>
  {product.title}
</Link>
```

## Update Flow

1. User clicks a product title, navigating to `/products-db/{id}`.
2. The server component fetches the product data.
3. The form renders with pre-populated default values.
4. User modifies fields and submits.
5. The `editProductWithId` function receives the bound ID, previous state, and form data.
6. Server action validates, updates the database via `updateProduct`, and redirects.

## Summary

| Concept | Implementation |
|---------|---------------|
| Dynamic route | `app/products-db/[id]/page.tsx` |
| Data fetching | Server component with `getProduct(id)` |
| Pre-populated form | `defaultValue` properties on inputs |
| Additional arguments | `Function.prototype.bind(null, id)` |
| Update server action | Accepts `(id, prevState, formData)` |
| Database call | `updateProduct(id, data)` |
| Redirect | `redirect("/products-db")` after success |

Splitting data fetching (server component) from form logic (client component) is required because client components cannot be `async`. The `bind` method cleanly passes the product ID to the server action without exposing it in the HTML.
