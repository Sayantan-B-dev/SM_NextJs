# Server and Client Components

## Introduction

Every component in a Next.js application defaults to being a server component. This includes the built-in root layout and root page. This chapter demonstrates how to create and work with both server and client components in practice.

## Default Server Component Behavior

Create a new project:

```bash
npx create-next-app@latest rendering-demo
```

Create an about page to verify the default server component behavior:

```tsx
// app/about/page.tsx
export default function AboutPage() {
  console.log('About server component');
  return <h1>About page</h1>;
}
```

When navigating to `/about`, the `console.log` appears in the **terminal** (not the browser console) with a `[server]` tag, confirming the component runs on the server.

## Server Component Limitations

Server components cannot use browser APIs or handle user interaction. Attempting to use state causes an error:

```tsx
// app/about/page.tsx -- THIS WILL FAIL
import { useState } from 'react';

export default function AboutPage() {
  const [name, setName] = useState(''); // Error: useState requires client component
  return <h1>About page</h1>;
}
```

Server components cannot maintain state because they run on the server, where browser-based state management does not exist.

## Creating a Client Component

To create a client component, add the `'use client'` directive at the top of the file:

```tsx
// app/dashboard/page.tsx
'use client';

import { useState } from 'react';

export default function DashboardPage() {
  const [name, setName] = useState('');

  return (
    <div>
      <h1>Dashboard</h1>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Hello {name}</p>
    </div>
  );
}
```

The `'use client'` directive signals to Next.js that this component, along with any components it imports, is intended for client-side execution.

Add a link from the home page:

```tsx
// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/dashboard">Dashboard</Link>
    </div>
  );
}
```

## Client Component Rendering Behavior

```tsx
'use client';

import { useState } from 'react';

export default function DashboardPage() {
  console.log('Dashboard client component');
  const [name, setName] = useState('');

  return (
    <div>
      <h1>Dashboard</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p>Hello {name}</p>
    </div>
  );
}
```

The rendering behavior depends on navigation type:

| Navigation Method | Rendering Location | Console Output |
|------------------|-------------------|---------------|
| Client-side (Link click) | Client only | Browser console only |
| Direct URL / Page reload | Server then Client | Terminal + Browser console |

**Explanation:**
- When navigating via the Link component, the dashboard component renders only on the client
- When reloading the page, the component renders once on the server (for the initial HTML) and again on the client during hydration
- The browser console shows two logs during development due to Strict Mode; production shows only one

## Key Takeaways

- In the RSC architecture (and by extension the Next.js App Router), components are server components by default
- To create client components, add the `'use client'` directive at the top of the file
- Server components render exclusively on the server
- Client components render once on the server (for initial HTML) and then on the client
- The `'use client'` directive is the boundary that marks a component and its children for client-side execution
