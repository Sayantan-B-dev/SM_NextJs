# Separating Server Actions

## Overview

Server actions defined with inline `"use server"` cannot coexist in files marked `"use client"`. The solution is to separate server actions into their own files where the module-level `"use server"` directive marks all exports as server actions.

## Architecture

```
src/
  actions/
    products.ts       # All product server actions (use server)
  components/
    submit.tsx        # Client component with useFormStatus
  ...
app/
  products-db-create/
    page.tsx          # Client component using useActionState
```

## Step 1: Create the Server Actions File

```typescript
// src/actions/products.ts
"use server";

import { addProduct } from "@/prisma-db";
import { redirect } from "next/navigation";

export type Errors = {
  title?: string;
  price?: string;
  description?: string;
};

export type FormState = {
  errors: Errors;
};

export async function createProduct(
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

  await addProduct({
    title,
    price: parseFloat(price),
    description,
  });

  redirect("/products-db");
}
```

### Key Points

- The `"use server"` directive is at the **top of the file**, marking all exports as server actions.
- Individual functions do **not** need their own `"use server"` directive.
- Types can be exported and shared between the action and client components.
- Imports from database utilities (`@/prisma-db`) and Next.js (`redirect`) are included here.

## Step 2: Update the Client Component

```typescript
// app/products-db-create/page.tsx
"use client";

import { useActionState } from "react";
import { createProduct, FormState } from "@/actions/products";

const initialState: FormState = {
  errors: {},
};

export default function AddProductPage() {
  const [state, formAction, isPending] = useActionState(
    createProduct,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4 p-8">
      <div>
        <label htmlFor="title" className="block mb-1">Title</label>
        <input id="title" name="title" type="text" className="border p-2 w-full" />
        {state.errors.title && (
          <p className="text-red-500 text-sm mt-1">{state.errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="price" className="block mb-1">Price</label>
        <input id="price" name="price" type="number" step="0.01" className="border p-2 w-full" />
        {state.errors.price && (
          <p className="text-red-500 text-sm mt-1">{state.errors.price}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block mb-1">Description</label>
        <textarea id="description" name="description" className="border p-2 w-full" />
        {state.errors.description && (
          <p className="text-red-500 text-sm mt-1">{state.errors.description}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {isPending ? "Submitting..." : "Add Product"}
      </button>
    </form>
  );
}
```

## Validation Behavior

With `useActionState`, the server action receives `prevState` as the first argument:

```typescript
async function createProduct(prevState: FormState, formData: FormData): Promise<FormState>
```

- **prevState**: The previous state returned by the action (or `initialState` on first call).
- **formData**: The form submission data.

When validation fails, errors are returned:

```typescript
if (!title) errors.title = "Title is required";
// ...
if (Object.keys(errors).length > 0) {
  return { errors };
}
```

The returned state object is captured by `useActionState` and accessible via `state.errors`.

## Benefits of Separation

| Concern | Before (same file) | After (separated) |
|---------|-------------------|-------------------|
| Server logic | Inline `"use server"` in page.tsx | Dedicated `actions/products.ts` |
| Client logic | Mixed with server code | `page.tsx` stays clean |
| Reusability | Tied to one page | Importable from any component |
| Type safety | Shared types inlined | Exported from actions file |
| Bundle size | Server code excluded | Still excluded from client bundle |

## Summary

Separating server actions into dedicated files resolves the `"use server"` in client components restriction. The module-level `"use server"` directive marks all exports as server actions, which can then be imported into client components alongside `useActionState`. This pattern keeps server-side logic secure, reusable, and separate from client-side concerns.
