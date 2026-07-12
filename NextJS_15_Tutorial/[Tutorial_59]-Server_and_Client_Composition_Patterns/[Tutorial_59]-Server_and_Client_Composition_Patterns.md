# Server and Client Composition Patterns

## Overview

Understanding when to use server components versus client components is essential for building efficient Next.js applications. This chapter provides a high-level guide to the composition patterns, with deeper dives in subsequent chapters.

## When to Use Server Components

| Use Case | Reason |
|----------|--------|
| Data fetching | Direct access to databases and APIs on the server |
| Backend resource access | Connect to file systems, databases, and internal services |
| Sensitive information | Keep API keys, tokens, and business logic on the server |
| Large dependencies | Dependencies stay on the server, reducing client bundle size |
| Static content | Content that does not require interactivity |

```tsx
// Server Component -- Good for data fetching
import { db } from '@/lib/database';

export default async function UserProfile({ userId }: { userId: string }) {
  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

## When to Use Client Components

| Use Case | Reason |
|----------|--------|
| Interactivity | Event listeners (onClick, onChange, onSubmit) |
| State management | useState, useReducer |
| Lifecycle effects | useEffect, useLayoutEffect |
| Browser-specific APIs | localStorage, geolocation, IntersectionObserver |
| Custom hooks | Hooks that use state, effects, or browser APIs |
| React Class Components | Class-based components require client rendering |

```tsx
'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}
```

## Decision Flow

```
Is the component interactive?
  YES --> Is it a class component or uses hooks (state, effects, browser APIs)?
    YES --> Client Component ('use client')
    NO --> Server Component
  NO --> Does it fetch data or access backend resources?
    YES --> Server Component
    NO --> Does it have large dependencies?
      YES --> Server Component (dependencies stay on server)
      NO --> Server Component (default)
```

## Important Rules

- Server components can import and render client components
- Client components cannot import server components
- Server components can pass serializable props to client components
- Server components can accept client components as children (via prop passing)

```tsx
// Server Component wrapping Client Component
import ClientInteractive from './ClientInteractive';

export default async function ServerWrapper() {
  const data = await fetchData();

  return (
    <div>
      <h1>Server-rendered content</h1>
      <ClientInteractive initialData={data} />
    </div>
  );
}
```

```tsx
'use client';

export default function ClientInteractive({
  initialData,
}: {
  initialData: unknown;
}) {
  // Client-side interactivity with server-fetched data
  return <div>{/* Interactive UI */}</div>;
}
```

## Summary

| Aspect | Server Components | Client Components |
|--------|------------------|-------------------|
| Data fetching | Direct (preferred) | Via API/fetch (in effects) |
| Interactivity | Not supported | Fully supported |
| Bundle impact | Zero | Full component code |
| Security | Sensitive code stays on server | Code exposed to browser |
| Dependencies | Large packages stay on server | All dependencies downloaded |

Server components are the default and should be used for data fetching and static rendering. Client components should be used sparingly for interactive elements that require browser APIs, state, or event handlers.
