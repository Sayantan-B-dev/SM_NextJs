# Client-only Code

## Overview

Just as server-only code must be isolated from the client, client-only code must be prevented from accidentally running on the server. Browser-specific features like `window`, `document`, `localStorage`, and DOM manipulation are not available in server-side rendering (SSR). The `client-only` npm package provides a safety net to catch such misuse at build time.

---

## What Is Client-only Code?

Client-only code is code that relies on browser-specific APIs:

- `window` object (e.g., `window.innerWidth`, `window.location`)
- `document` object (e.g., `document.querySelector`)
- `localStorage` / `sessionStorage`
- DOM manipulation
- `navigator` API

These APIs throw errors when executed during server-side rendering or in server components.

---

## The `client-only` Package

The `client-only` package ensures that a module is never imported on the server. If someone tries to use it in a server component, the build will fail with a clear error message.

### Installation

```bash
npm install client-only --force
```

---

## Example: Client-only Utility Function

### 1. Create a Client-only Module

```ts
// utils/client.ts
import "client-only";

export const clientSideFunction = () => {
  console.log("use window object");
  console.log("use local storage");
  return "client result";
};
```

The `import "client-only"` line acts as a guard. If any server component imports this module, the build fails.

### 2. Use in a Client Component

```tsx
// app/client-route/page.tsx
"use client";

import { clientSideFunction } from "@/utils/client";

export default function ClientRoute() {
  const result = clientSideFunction();

  return <p>{result}</p>;
}
```

This works correctly -- the function runs in the browser.

### 3. Attempted Use in a Server Component (Fails)

```tsx
// app/server-route/page.tsx
import { clientSideFunction } from "@/utils/client";

export default function ServerRoute() {
  const result = clientSideFunction();

  return <h1>{result}</h1>;
}
```

This produces a build-time error:

```
You're importing a component that imports "client-only". It only works in a Client Component but none of its parents are marked with "use client", so they're Server Components by default.
```

---

## Comparison: Error Prevention Strategies

| Strategy | Detection Time | Error Message | Granularity |
|---|---|---|---|
| `client-only` package | Build time | Clear and actionable | Per module |
| Manual testing | Runtime | Cryptic reference errors | N/A |
| TypeScript checks | Compile time | Limited | Limited |

---

## Best Practices

| Practice | Description |
|---|---|
| Isolate client logic | Keep browser-only code in dedicated files under `utils/` or `lib/` |
| Add guard early | Import `client-only` at the top of any file that uses browser APIs |
| Export clearly | Use named exports so the module's purpose is obvious |
| Never assume | Do not assume a component will only be used on the client |

---

## Pattern Summary

```
Client Component ("use client")
  |
  +-- imports clientUtils.ts (has import "client-only")
  |     +-- window, localStorage, document APIs
  |
  +-- renders UI with browser features

Server Component (no "use client")
  |
  +-- imports clientUtils.ts --> BUILD ERROR (caught early)
```

---

## Key Takeaway

> Just as server-only code needs isolation, client-only code needs to stay on the client side where it can properly use browser features. The `client-only` package acts as a safety net, making sure client-side code stays where it belongs -- caught at build time, not runtime.
