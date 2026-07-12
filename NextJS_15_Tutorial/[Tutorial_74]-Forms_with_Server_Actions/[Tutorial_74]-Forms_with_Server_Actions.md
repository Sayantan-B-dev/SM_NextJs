# Forms with Server Actions

## Overview

Server Actions are asynchronous functions executed on the server. They can be called from both server and client components to handle form submissions and data mutations, eliminating the need for separate API routes.

## When to Use Server Actions

- Secure database operations requiring server-side execution
- Reducing API boilerplate code
- Progressive enhancement for forms (works without JavaScript)
- Performance optimization (less client-side JavaScript)

## The `use server` Directive

A server action can be defined in two ways:

| Approach | Directive Placement | Scope |
|----------|---------------------|-------|
| Inline | Top of an async function | Single function |
| Module-level | Top of a separate file | All exports in the file |

## Basic Implementation

### Project Structure

```
app/
  products-db-create/
    page.tsx
```

### Server Action with Form

```typescript
// app/products-db-create/page.tsx
import { addProduct } from "@/prisma-db";
import { redirect } from "next/navigation";

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
      <div>
        <label htmlFor="title" className="block mb-1">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className="border p-2 w-full"
          required
        />
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
          required
        />
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
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Product
      </button>
    </form>
  );
}
```

## How It Works

1. The form's `action` attribute is set to the `createProduct` server action.
2. When the form is submitted, the `FormData` is automatically passed to the function.
3. The server action runs on the server, accessing the database directly via `addProduct`.
4. After success, `redirect()` sends the user to the products listing page.

## Benefits Compared to Traditional Approach

| Feature | Traditional (API Routes) | Server Actions |
|---------|-------------------------|----------------|
| API route file | Required | Not needed |
| Client-side state | `useState` for fields | None |
| `onSubmit` handler | Required | Not needed |
| Fetch request | Manual `fetch()` call | Automatic |
| Code location | Spread across files | In one component |
| Security | Manual validation | Server-side execution |
| Progressive enhancement | Requires JS | Works without JS |

## Progressive Enhancement

Server actions support progressive enhancement -- forms work even when JavaScript is disabled in the browser. The server action still processes the submission via a full-page POST request.

To test:
1. Open DevTools > Sources panel
2. Press `Ctrl+Shift+P` and search for "Disable JavaScript"
3. Submit the form -- the product is still created

## Network Behavior

When a server action is called:
1. A `POST` network request is sent to the server
2. The server executes the action function
3. On completion, the server sends back the response or redirect

## Important Considerations

- **Form fields need `name` attributes** for `formData.get()` to work.
- **Numeric fields** require explicit parsing (`parseFloat` or `parseInt`).
- **Server components only**: Inline `"use server"` functions work in server components only. Client components require imported server actions from separate files.
- **The code never reaches the client** -- server actions are excluded from the client bundle.

## Summary

Server actions transform form handling by removing API route boilerplate, client-side state management, and manual fetch calls. They provide a secure, performant, and progressively-enhanced way to handle data mutations in Next.js applications.
