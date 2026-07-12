# Form Validation with useActionState

## Overview

`useActionState` is a React hook that allows state to be updated based on the result of a form action. It is particularly useful for form validation and error message display.

## Hook Signature

```typescript
const [state, formAction, isPending] = useActionState(action, initialState);
```

| Return Value | Type | Description |
|-------------|------|-------------|
| `state` | `FormState` | Current state returned by the action |
| `formAction` | `function` | Wrapped action to pass to the form's `action` prop |
| `isPending` | `boolean` | Indicates if the action is currently executing |

## Defining Types for Validation

```typescript
type Errors = {
  title?: string;
  price?: string;
  description?: string;
};

type FormState = {
  errors: Errors;
};
```

## Adding Validation to the Server Action

```typescript
async function createProduct(prevState: FormState, formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const price = formData.get("price") as string;
  const description = formData.get("description") as string;

  const errors: Errors = {};

  if (!title) {
    errors.title = "Title is required";
  }

  if (!price) {
    errors.price = "Price is required";
  }

  if (!description) {
    errors.description = "Description is required";
  }

  // If validation errors exist, return them without inserting
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // Proceed with database insertion
  await addProduct({
    title,
    price: parseFloat(price),
    description,
  });

  redirect("/products-db");
}
```

**Key change**: When using `useActionState`, the server action receives `prevState` as its **first argument** and `formData` as the second.

## Using useActionState in a Component

```typescript
"use client";

import { useActionState } from "react";
import { createProduct } from "@/actions/products";

type Errors = {
  title?: string;
  price?: string;
  description?: string;
};

type FormState = {
  errors: Errors;
};

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
        <label htmlFor="title" className="block mb-1">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className="border p-2 w-full"
        />
        {state.errors.title && (
          <p className="text-red-500 text-sm mt-1">{state.errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="price" className="block mb-1">
          Price
        </label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          className="border p-2 w-full"
        />
        {state.errors.price && (
          <p className="text-red-500 text-sm mt-1">{state.errors.price}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="border p-2 w-full"
        />
        {state.errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {state.errors.description}
          </p>
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

## Validation Flow

1. User submits the form with empty/invalid fields.
2. The server action validates the data.
3. If validation fails, an errors object is returned (not thrown).
4. `useActionState` captures the returned state and re-renders the component.
5. Error messages are displayed conditionally based on `state.errors`.
6. If validation passes, the product is created and the user is redirected.

## Error: Inline Server Actions in Client Components

Defining an inline `"use server"` action inside a component marked `"use client"` causes an error:

```
It is not allowed to define inline "use server" annotated Server Actions in Client Components.
```

**Solution**: Move the server action to a separate file (covered in Tutorial 77).

## Summary

`useActionState` enables server-side form validation with client-side error display. The server action validates data and returns an error state object, which the hook captures and makes available for conditional rendering. The `isPending` boolean optionally controls button disabled state during submission.
