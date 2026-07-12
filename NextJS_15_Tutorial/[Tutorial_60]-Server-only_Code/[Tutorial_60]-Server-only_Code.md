# Server-only Code

## Overview

Some code is designed to run exclusively on the server: modules handling environment variables, database connections, or sensitive business logic. Since JavaScript modules can be shared between server and client components, server-only code could accidentally end up in the client bundle, causing security risks and performance issues.

## Risks of Server Code Leaking to the Client

| Risk | Consequence |
|------|------------|
| Larger bundle sizes | Server-side dependencies downloaded by the browser |
| Exposed secret keys | API keys, tokens, and credentials visible in client code |
| Exposed database queries | Database structure and query patterns revealed |
| Exposed business logic | Proprietary algorithms and logic sent to the browser |
| Runtime errors | Server-specific APIs (fs, crypto) fail in the browser |

## Example: The Problem

### Server-only Utility

```tsx
// src/utils/server-utils.ts
export const serverSideFunction = () => {
  console.log('Server-only function executing');
  // Could be: database calls, env variable access, business logic
  return 'Server result';
};
```

### Server Component (Safe)

```tsx
// app/server-route/page.tsx
import { serverSideFunction } from '@/utils/server-utils';

export default function ServerRoutePage() {
  const result = serverSideFunction();
  return <h1>Server route: {result}</h1>;
}
```

This works correctly. The log appears in the terminal with a `[server]` tag.

### Client Component (Problematic)

```tsx
// app/client-route/page.tsx
'use client';

import { serverSideFunction } from '@/utils/server-utils';

export default function ClientRoutePage() {
  const result = serverSideFunction();
  return <h1>Client route: {result}</h1>;
}
```

This is problematic because:
- The log appears in the **browser console** (code runs on the client)
- The entire `serverSideFunction` and its dependencies are included in the client bundle
- Any sensitive operations in this function are now exposed

## Solution: The `server-only` Package

The `server-only` npm package provides a build-time guard against importing server code into client components.

### Installation

```bash
npm install server-only
```

### Usage

```tsx
// src/utils/server-utils.ts
import 'server-only';

export const serverSideFunction = () => {
  console.log('Server-only function executing');
  return 'Server result';
};
```

By adding `import 'server-only'` at the top of the module, any attempt to import this module into a client component will **fail at build time** with a clear error message.

### Result

```tsx
// app/client-route/page.tsx
'use client';

import { serverSideFunction } from '@/utils/server-utils';
// Build error: This module is meant for server-side use only
```

The build fails immediately, preventing the server code from reaching the client bundle.

## Best Practices

### Identify Server-Only Modules

Mark any module that contains any of the following as `server-only`:

```tsx
import 'server-only';

// Database access
import { db } from '@/lib/database';

// Environment variables
const API_KEY = process.env.API_KEY;

// File system operations
import fs from 'fs';

// Server-side utilities
export async function getSensitiveData() {
  // ...
}
```

### Separate Concerns

```
src/
  utils/
    server-utils.ts      # import 'server-only'
    client-utils.ts      # Safe for client use
    shared-utils.ts      # No server-only import, safe for both
```

### Defense in Depth

Use multiple layers of protection:
1. `server-only` package for build-time errors
2. Code organization to clearly separate server vs client code
3. Environment variable naming conventions (`NEXT_PUBLIC_` for client-safe vars)
4. Regular bundle analysis to catch unintended client imports

## Summary

| Practice | Purpose |
|----------|---------|
| `import 'server-only'` | Throws build error if misused in client code |
| Separate files for server/client logic | Clear code organization |
| Bundle analysis | Detect unintended client-side server code |
| Environment variable prefixes | Distinguish public vs private variables |

Keeping server-only code separate from client-side code is essential for security, performance, and reliability. The `server-only` package enforces this separation at build time, making your application more robust and secure.
