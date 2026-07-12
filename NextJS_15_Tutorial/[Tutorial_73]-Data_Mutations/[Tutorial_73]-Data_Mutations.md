# Data Mutations

## Overview

Data mutations cover the Create, Update, and Delete operations of CRUD. This tutorial compares the **traditional React approach** (client-side state management + API routes) with the **Next.js App Router approach** (server actions), highlighting how the latter dramatically simplifies mutation logic.

## Traditional React Approach

### Architecture

```
Client Component (form state + submit handler)
  -> API Route (server-side endpoint)
    -> Database function (Prisma)
```

### Implementation

```typescript
// app/react-form/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProduct() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        price: parseFloat(price),
        description,
      }),
    });

    if (res.ok) {
      router.push("/products-db");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-8">
      <div>
        <label htmlFor="title" className="block mb-1">Title</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="price" className="block mb-1">Price</label>
        <input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-1">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {isLoading ? "Submitting..." : "Add Product"}
      </button>
    </form>
  );
}
```

### API Route

```typescript
// app/api/products/route.ts
import { addProduct } from "@/prisma-db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { title, price, description } = await request.json();
  const product = await addProduct({ title, price, description });
  return NextResponse.json(product, { status: 201 });
}
```

### Complexity of the Traditional Approach

| Aspect | What You Need |
|--------|---------------|
| Form state | `useState` for each field |
| Submission | `onSubmit` handler with `fetch` |
| API route | Separate endpoint file |
| Loading state | Manual `isLoading` boolean |
| Redirect | `useRouter().push()` after success |
| Error handling | Manual try/catch on both client and API |

## Problems with the Traditional Approach

- **Client cannot talk to the database directly** for security reasons, requiring an API route.
- **Boilerplate code** for state management, event handlers, and API calls.
- **Multiple concerns spread across files** (form component + API route).
- **Heavy client-side JavaScript** bundle.

## The App Router Solution

The Next.js App Router replaces this entire flow with **Server Actions**:

```
Client Form
  -> Server Action (async function with 'use server')
    -> Database function (Prisma)
```

No API route, no client-side state, no manual loading flags -- just a form element with an `action` attribute pointing to a server function.

## Summary

| Approach | API Route | Client State | Form Handling | Bundle Size |
|----------|-----------|--------------|---------------|-------------|
| Traditional | Required | Required | Manual | Larger |
| Server Actions | Not needed | Not needed | Automatic | Smaller |

The traditional approach adds significant complexity. Server actions (covered in the next tutorial) provide a streamlined, secure, and performant alternative.
