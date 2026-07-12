# Dynamic Rendering

## Overview

Dynamic rendering is a server rendering strategy where routes are rendered **uniquely for each request**. Unlike static rendering, which pre-generates HTML at build time, dynamic rendering generates the HTML on demand when a user makes a request.

## When to Use Dynamic Rendering

- Personalized data or user-specific content
- Information available only at request time
- Pages using cookies or URL search parameters
- News websites with constantly updating content
- Personalized shopping pages
- Social media feeds

## Triggering Dynamic Rendering

Next.js automatically switches to dynamic rendering for an entire route when it detects a **dynamic function** or **dynamic API**:

| Dynamic Function | Description |
|-----------------|-------------|
| `cookies()` | Read/write cookies |
| `headers()` | Access request headers |
| `connection()` | Get connection information |
| `draftMode()` | Enable draft mode |
| `searchParams` | Access URL query parameters |
| `after()` | Schedule post-response work |

Using **any** of these functions automatically opts the entire route into dynamic rendering.

## Example: Using Cookies

```tsx
// app/about/page.tsx
import { cookies } from 'next/headers';

export default async function AboutPage() {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme');
  console.log(theme);

  return (
    <div>
      <h1>About page</h1>
      <p>{new Date().toLocaleTimeString()}</p>
    </div>
  );
}
```

When this route is dynamically rendered:
- The `[λ]` symbol (or `ƒ` for dynamic) appears in the build output
- No HTML file is generated for this route in the build output
- Each request generates a fresh HTML response
- The timestamp updates on every refresh

## Build Output Comparison

### Static Route

```
.next/server/app/
  index.html          # Generated at build time
  about.html          # Generated at build time
  about.rsc           # RSC payload at build time
```

### Dynamic Route

```
.next/server/app/
  index.html          # Still generated at build time
  # about.html -- NOT present
  # about.rsc -- NOT present
```

## Network Behavior

When a dynamically rendered page is requested:
- The browser sends the request to the server
- The server executes the component
- The server generates HTML with fresh data
- The response includes the complete HTML
- Each refresh returns the latest content

## Forcing Dynamic Rendering

While Next.js automatically selects the strategy, you can force dynamic rendering:

```tsx
// app/page.tsx
export const dynamic = 'force-dynamic';

export default function Page() {
  return <h1>This route is always dynamic</h1>;
}
```

## Summary

| Aspect | Static Rendering | Dynamic Rendering |
|--------|-----------------|-------------------|
| HTML generation | At build time | At request time |
| Build output | HTML + RSC files exist | No HTML in build output |
| Data freshness | Frozen at build time | Fresh per request |
| Performance | Fastest (cached) | Slower (per-request) |
| Use case | Blogs, docs | Personalized content |
| Symbol | Hollow circle | Lambda / F |

Next.js automatically selects the optimal rendering strategy based on the features and APIs used in each route.
