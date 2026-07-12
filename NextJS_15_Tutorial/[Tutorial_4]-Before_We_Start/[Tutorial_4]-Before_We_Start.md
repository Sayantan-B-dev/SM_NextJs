# Before We Start

Before exploring routing in Next.js, it is essential to understand **React Server Components (RSC)**, a core architecture that Next.js adopts.

## Server Components vs Client Components

React Server Components divide components into two distinct types:

### Server Components (Default)

By default, **every component in Next.js is a Server Component**. These components:

- Can perform server-side tasks (reading files, fetching data from a database)
- Cannot use React hooks (`useState`, `useEffect`, etc.)
- Cannot handle user interactions (onClick, onChange, etc.)
- Reduce the JavaScript bundle sent to the client

```typescript
// This is a Server Component by default (no directive needed)
export default async function ProductList() {
  const products = await fetch("https://api.example.com/products");
  const data = await products.json();

  return (
    <ul>
      {data.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

### Client Components

To create a Client Component, add the `"use client"` directive at the top of the file:

```typescript
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

Client Components:
- Cannot perform server-side tasks (reading files, direct database access)
- Can use React hooks and handle user interactions
- Are similar to traditional React components from earlier versions

## Key Differences

| Aspect | Server Component | Client Component |
|--------|-----------------|-----------------|
| Directive | None (default) | `"use client"` at top |
| Hooks | Not supported | Supported |
| User Interactions | Not supported | Supported |
| Server-side tasks | Supported | Not supported |
| JavaScript bundle impact | Minimal (no JS sent) | Full component JS sent |

## Practical Implication for Routing

Throughout the routing tutorials, you will encounter:

- **Server Components** -- Used for pages that fetch data or wait for operations to complete before rendering
- **Client Components** -- Used when hooks from the routing module (like `usePathname`, `useParams`) are needed

## Summary

- Every component is a Server Component by default
- Add `"use client"` to use hooks or handle interactions
- Server Components can perform server-side tasks directly
- Client Components are the traditional React components you are familiar with

This foundation is crucial for understanding the routing examples that follow. We will explore React Server Components in much more detail later in the course.
