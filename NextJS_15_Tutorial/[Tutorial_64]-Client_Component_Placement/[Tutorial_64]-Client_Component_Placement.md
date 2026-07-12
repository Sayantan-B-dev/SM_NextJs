# Client Component Placement

## Overview

When adding interactivity to your application, it is crucial to place `"use client"` components as low as possible in the component tree -- ideally at the leaf nodes. Marking a high-level component with `"use client"` converts not only that component but also every child component beneath it to client components, losing the benefits of server-side rendering.

---

## The Problem: Cascading Client Components

Consider a landing page with this component tree:

```
LandingPage (server)
  |
  +-- Navbar
        |
        +-- NavLinks
        +-- NavSearch (needs state)
```

If you add `"use client"` to `Navbar` (because `NavSearch` needs `useState`), the entire subtree becomes client components:

```
Navbar ("use client")            <-- client
  |
  +-- NavLinks                   <-- client (unnecessarily)
  +-- NavSearch ("use client")   <-- client
```

This means:
- More JavaScript sent to the browser
- Lost server-side rendering benefits for `NavLinks`
- Larger client-side bundle

---

## The Solution: Push Client Components to Leaf Nodes

Instead, keep `Navbar` as a server component and only add `"use client"` to `NavSearch`.

```
LandingPage (server)
  |
  +-- Navbar (server)
        |
        +-- NavLinks (server)
        +-- NavSearch ("use client")   <-- only this is client
```

---

## Example: Before and After

### Incorrect: Marking the Parent

```tsx
// components/Navbar.tsx
"use client"; // <-- This is too high in the tree

import { useState } from "react";
import { NavLinks } from "./NavLinks";
import { NavSearch } from "./NavSearch";

export function Navbar() {
  const [search, setSearch] = useState("");

  return (
    <nav>
      <NavLinks />
      <NavSearch search={search} setSearch={setSearch} />
    </nav>
  );
}
```

In this approach, `NavLinks` also becomes a client component even though it has no interactivity.

### Correct: Only Mark the Leaf

```tsx
// components/NavSearch.tsx
"use client";

import { useState } from "react";

export function NavSearch() {
  const [search, setSearch] = useState("");

  return (
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

```tsx
// components/Navbar.tsx (server component)
import { NavLinks } from "./NavLinks";
import { NavSearch } from "./NavSearch";

export function Navbar() {
  return (
    <nav>
      <NavLinks />
      <NavSearch />
    </nav>
  );
}
```

---

## Understanding the Client Boundary

The `"use client"` directive draws a **boundary line** in the component tree. Everything below that line runs on the client:

```
Client Boundary
      |
      v
[Server Component]
      |
      +-- [Client Component with "use client"]
            |
            +-- [Child Client Component] (also client)
            +-- [Another Child Client Component] (also client)
```

---

## Best Practices for Component Placement

| Strategy | Description |
|---|---|
| Deep over high | Place `"use client"` as deep in the tree as possible |
| Leaf components preferred | Only add interactivity to the component that needs it |
| Server-first default | Keep components as server components until interactivity is required |
| Extract interactive parts | If a component needs both server and client features, split it into parent (server) and child (client) |

---

## Identifying Render Location

You can verify where a component renders by checking console output:

- **Server component**: Logs appear in the terminal
- **Client component**: Logs appear in the browser dev tools console

---

## Key Takeaway

> Place `"use client"` components as low as possible in your component tree -- ideally as leaf nodes. This preserves the benefits of server components for the rest of the tree and minimizes the client-side JavaScript bundle.
