# Interleaving Server and Client Components

## Overview

Understanding which patterns of nesting server and client components are supported in Next.js is essential for building correct, performant applications. This tutorial covers all four composition patterns and explains the one unsupported pattern along with its workaround.

---

## Component Setup

For demonstration, we need two server components and two client components.

### Server Component

```tsx
// components/ServerComponent1.tsx
import fs from "fs";

export function ServerComponent1() {
  fs.readFileSync("some-path", "utf8");

  return <h1>Server Component 1</h1>;
}
```

```tsx
// components/ServerComponent2.tsx
import fs from "fs";

export function ServerComponent2() {
  fs.readFileSync("another-path", "utf8");

  return <h1>Server Component 2</h1>;
}
```

### Client Component

```tsx
// components/ClientComponent1.tsx
"use client";

import { useState } from "react";

export function ClientComponent1() {
  const [name, setName] = useState("Batman");

  return <h1>Client Component 1</h1>;
}
```

```tsx
// components/ClientComponent2.tsx
"use client";

import { useState } from "react";

export function ClientComponent2() {
  const [name, setName] = useState("Batman");

  return <h1>Client Component 2</h1>;
}
```

---

## All Four Interleaving Patterns

### Pattern 1: Server Component Inside Server Component

```tsx
// app/interleaving/page.tsx
import { ServerComponent1 } from "@/components/ServerComponent1";
import { ServerComponent2 } from "@/components/ServerComponent2";

export default function InterleavingPage() {
  return (
    <ServerComponent1>
      <ServerComponent2 />
    </ServerComponent1>
  );
}
```

**Result: Works without any issues.**

### Pattern 2: Client Component Inside Client Component

```tsx
// app/interleaving/page.tsx
import { ClientComponent1 } from "@/components/ClientComponent1";
import { ClientComponent2 } from "@/components/ClientComponent2";

export default function InterleavingPage() {
  return (
    <ClientComponent1>
      <ClientComponent2 />
    </ClientComponent1>
  );
}
```

**Result: Works without any issues.**

### Pattern 3: Client Component Inside Server Component

```tsx
// app/interleaving/page.tsx
import { ServerComponent1 } from "@/components/ServerComponent1";
import { ClientComponent1 } from "@/components/ClientComponent1";

export default function InterleavingPage() {
  return (
    <ServerComponent1>
      <ClientComponent1 />
    </ServerComponent1>
  );
}
```

**Result: Works without any issues.**

### Pattern 4: Server Component Inside Client Component (UNSUPPORTED)

```tsx
// app/interleaving/page.tsx
import { ClientComponent1 } from "@/components/ClientComponent1";
import { ServerComponent1 } from "@/components/ServerComponent1";

export default function InterleavingPage() {
  return (
    <ClientComponent1>
      <ServerComponent1 /> {/* ERROR: This does not work */}
    </ClientComponent1>
  );
}
```

**Result: Fails with module resolution error** (e.g., `Module not found: Can't resolve 'fs'`) because the server component becomes a client component when nested inside a client component.

---

## The Workaround: Children Prop (Slot Pattern)

Instead of importing and nesting a server component directly inside a client component, pass it as a prop -- typically the `children` prop.

### Correct Approach

```tsx
// app/interleaving/page.tsx
import { ClientComponent1 } from "@/components/ClientComponent1";
import { ServerComponent1 } from "@/components/ServerComponent1";

export default function InterleavingPage() {
  return (
    <ClientComponent1>
      <ServerComponent1 />
    </ClientComponent1>
  );
}
```

```tsx
// components/ClientComponent1.tsx
"use client";

export function ClientComponent1({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>Client Component 1</h1>
      {children} {/* ServerComponent1 renders here as a server component */}
    </div>
  );
}
```

When the server component is passed as `children`, it is **not** re-imported inside the client component. Instead, it is rendered on the server and the result is passed into the client component. The client component simply renders whatever it receives.

---

## Pattern Comparison Table

| Pattern | Supported | Example |
|---|---|---|
| Server -> Server | Yes | `<SC1><SC2 /></SC1>` |
| Client -> Client | Yes | `<CC1><CC2 /></CC1>` |
| Client in Server | Yes | `<SC1><CC1 /></SC1>` |
| Server in Client (direct import) | No | `<CC1><SC1 /></CC1>` |
| Server as children of Client | Yes | `<CC1><SC1 /></CC1>` with `{children}` |

---

## Why the Children Prop Works

The `children` prop pattern works because:

1. The server component is **rendered on the server** before being passed to the client component
2. The client component receives the **already-rendered result** (React nodes)
3. No import of the server component happens inside the client component file
4. The `"use client"` boundary is preserved -- the server component stays a server component

---

## Key Takeaway

> You cannot import a server component directly into a client component file. Instead, pass server components as props (typically `children`) to client components. This creates a slot where the server component is rendered on the server and the result is injected into the client component.
