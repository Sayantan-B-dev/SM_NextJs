# React Server Components

## Overview

React Server Components (RSC) represent a new architecture designed by the React team that leverages the strengths of both server and client environments to optimize efficiency, load times, and interactivity. This architecture introduces a dual component model that differentiates components based on their execution environment rather than their functionality.

## Evolution of React Rendering

React rendering has evolved through several stages:

| Era | Approach | Key Characteristic |
|-----|----------|-------------------|
| Initial | Client-Side Rendering (CSR) | Full rendering in the browser |
| Intermediate | Server-Side Rendering (SSR) | HTML generated on the server |
| Advanced | Suspense SSR | Streaming HTML with progressive loading |
| Current | React Server Components (RSC) | Dual component model (server + client) |

Each step improved the developer and user experience but introduced new challenges. Suspense with SSR brought us closer to a seamless experience, but bundle sizes remained large, causing excessive downloads, delayed hydration, and heavy client-side processing.

## The Dual Component Model

RSC introduces two distinct component types:

### Client Components

Client components are the familiar React components used in previous rendering techniques. They are typically rendered on the client side but can also render to HTML once on the server as an optimization strategy, allowing users to immediately see the page's HTML content rather than a blank screen.

**Characteristics:**
- Full access to the client environment (browser)
- Can use State, Effects, and event listeners for interactivity
- Access to browser-exclusive APIs (geolocation, localStorage)
- Can be pre-rendered on the server for faster initial load

```tsx
'use client';

import { useState } from 'react';

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

### Server Components

Server components represent a new type of React component designed to operate exclusively on the server. Their code stays on the server and is never downloaded to the client.

**Characteristics:**
- Execute only on the server
- Zero bundle size impact
- No hydration step required
- Direct access to server resources
- Cannot handle interactivity or browser APIs

```tsx
import { db } from '@/lib/database';

export default async function ProductList() {
  const products = await db.product.findMany();

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

## Benefits of Server Components

### Smaller Bundle Sizes

Server components keep all their dependencies on the server. Users with slower connections or less powerful devices do not need to download, parse, and execute that JavaScript.

### Direct Server Resource Access

Server components can communicate directly with databases and file systems, making data fetching efficient without any client-side processing.

### Enhanced Security

Since server components run only on the server, sensitive data and logic such as API keys and tokens never leave the server.

### Smarter Data Fetching

Moving data fetching to the server, closer to the data source, reduces the time needed to fetch data and the number of requests the client must make.

### Built-in Caching

Server-rendered results can be cached and reused across different users and requests, improving performance and reducing costs.

### Improved Initial Page Load

Generating HTML on the server means users see content immediately without waiting for JavaScript to download and execute.

### Better SEO

Search engine bots can easily read server-rendered HTML, making pages more indexable.

### Streaming Support

Server components can split the rendering process into chunks that stream to the client as they are ready, so users see content faster instead of waiting for the entire page.

## Server vs Client Components Comparison

| Feature | Server Component | Client Component |
|---------|-----------------|-----------------|
| Execution environment | Server only | Server (initial) + Browser |
| Bundle size | Zero | Full component code |
| State management | Not supported | useState, useReducer |
| Effects | Not supported | useEffect, useLayoutEffect |
| Event listeners | Not supported | onClick, onSubmit, etc. |
| Browser APIs | Not supported | Full access |
| Database access | Direct | Via API routes only |
| Data fetching | On the server | On the client or via server |
| Hydration | Not needed | Required |
| Streaming | Supported | Supported via Suspense |

## Key Takeaways

- React Server Components offer a new approach by separating components into server and client types
- Server components run exclusively on the server, fetching data and preparing content without sending code to the browser
- Server components cannot handle interactions
- Client components run in the browser and manage all interactive parts (clicks, typing, etc.)
- Client components receive an initial server render for faster page loads
- Together, they make websites faster, more secure, and accessible to users regardless of device or location
- The Next.js App Router is built entirely on the RSC architecture
