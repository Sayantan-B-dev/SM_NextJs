# Pending State with useFormStatus

## Overview

The `useFormStatus` hook provides status information about the most recent form submission. It allows you to give users visual feedback (disabling buttons, showing spinners) during form processing.

## Hook Return Values

| Property | Type | Description |
|----------|------|-------------|
| `pending` | `boolean` | Indicates if the parent form is currently submitting |
| `data` | `FormData | null` | The form data being submitted |
| `method` | `string` | HTTP method (`"get"` or `"post"`) |
| `action` | `function | null` | Reference to the function passed to the form's `action` prop |

For most use cases, `pending` is the primary property used.

## Architecture Strategy

Hooks can only be used in **client components**. Converting the entire page to a client component would lose server component benefits. The solution is to extract just the submit button into a separate client component.

```
Server Component (page.tsx)
  - Form structure
  - Field inputs
  - Client Component (Submit.tsx)
    - useFormStatus hook
    - Submit button with pending state
```

## Implementation

### Step 1: Create a Client Submit Component

```typescript
// src/components/submit.tsx
"use client";

import { useFormStatus } from "react-dom";

export const Submit = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`px-4 py-2 rounded text-white ${
        pending
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
};
```

### Step 2: Use in the Server Component

```typescript
// app/products-db-create/page.tsx
import { addProduct } from "@/prisma-db";
import { redirect } from "next/navigation";
import { Submit } from "@/components/submit";

export default function AddProductPage() {
  async function createProduct(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const price = parseFloat(formData.get("price") as string);
    const description = formData.get("description") as string;

    await addProduct({ title, price, description });
    redirect("/products-db");
  }

  return (
    <form action={createProduct} className="space-y-4 p-8">
      {/* ... input fields ... */}
      <Submit />
    </form>
  );
}
```

## How It Works

1. When the form is submitted, `pending` becomes `true`.
2. The submit button is immediately disabled (`disabled={pending}`).
3. Visual feedback (grayed-out button, text change) informs the user.
4. When the server action completes, `pending` returns to `false`.
5. The button re-enables automatically.

## Important: The Client Component Must Be a Child of the Form

The `useFormStatus` hook only works when the component is rendered **inside** a `<form>` element. It reads the status of the **parent form**, so it cannot be used outside the form or in a sibling context.

```
<form action={...}>
  <Submit />      {/* useFormStatus works here */}
</form>
```

## Extending the Pattern

You can enhance the submit component with additional feedback:

```typescript
"use client";

import { useFormStatus } from "react-dom";

export const Submit = () => {
  const { pending, data } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`px-4 py-2 rounded text-white flex items-center gap-2 ${
        pending
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {pending && (
        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
      )}
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
};
```

## Benefits of This Pattern

| Benefit | Description |
|---------|-------------|
| Server component preservation | Main page stays as a server component |
| Reusability | Submit button can be reused across forms |
| Progressive enhancement | Works without JavaScript (full page reload) |
| Accessibility | Disabled button prevents double submission |

## Summary

Use `useFormStatus` to manage pending state for form submissions. By extracting the submit button into a separate client component, you get dynamic UX updates without sacrificing server component benefits. The `pending` boolean is the primary property for toggling disabled states and showing loading indicators.
