# Data Fetching

## Overview

Data fetching is a core concern in any real-world application. Next.js with the App Router (built on React Server Components) gives you the flexibility to fetch data in both server and client components. However, server components are the preferred approach for most data-fetching scenarios due to their performance, security, and developer experience advantages.

---

## Where to Fetch Data

### Server Components (Recommended)

Fetching data in server components offers several advantages over client-side approaches:

| Benefit | Description |
|---|---|
| Direct data access | Communicate with databases, file systems, and internal APIs directly without exposing endpoints |
| Better performance | Closer to data sources reduces network latency and eliminates client-server round trips |
| Smaller client bundle | Heavy data processing, serialization, and transformation happens server-side |
| Security | API keys, secrets, database credentials, and sensitive operations stay on the server |
| No loading states | Data is fully available before the component is sent to the client |
| SEO friendly | Search engines receive fully populated pages |

### Client Components

Client-side data fetching is appropriate when:

- You need **real-time updates** via WebSockets or Server-Sent Events
- Data depends on **client-side interactions** such as user input, scroll position, or browser events
- You are using third-party data libraries that require client APIs (e.g., Apollo Client, React Query)
- You need to fetch data in response to user actions like form submissions

---

## Data Fetching Approaches

| Approach | Component Type | Mechanism | Best For |
|---|---|---|---|
| Server Component fetching | Server | `async` component with `await fetch()` | Initial page data, database queries |
| Client Component fetching | Client | `useEffect` + `useState` or data fetching library | Real-time data, user-triggered fetches |
| Route Handlers | API routes | Request/response-based API endpoints | External API consumption, webhooks |
| Server Actions | Server | Functions invoked from client components | Mutations, form submissions |

---

## Key Concepts

### Request Memoization

React deduplicates identical `fetch` requests made during the same render pass. This means you can fetch the same data in multiple components without redundant network calls:

```tsx
// Both components fetch the same URL during the same render
// React makes only ONE network request

async function Sidebar() {
  const user = await fetch("/api/user").then(r => r.json());
  // Uses the memoized result
}

async function Header() {
  const user = await fetch("/api/user").then(r => r.json());
  // Reuses the result from Sidebar's fetch
}
```

### Streaming

Server components support streaming, allowing you to send parts of the UI progressively:

```tsx
import { Suspense } from "react";

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<div>Loading posts...</div>}>
        <PostList />
      </Suspense>
      <Suspense fallback={<div>Loading comments...</div>}>
        <CommentList />
      </Suspense>
    </div>
  );
}
```

### Parallel vs Sequential Fetching

| Pattern | Total Time | Use Case |
|---|---|---|
| Parallel (`Promise.all`) | Max(request times) | Independent data sources |
| Sequential (await each) | Sum(request times) | Dependent data (post -> author) |

---

## Getting Started

To follow along with the tutorials in this section, create a fresh Next.js project:

```bash
npx create-next-app@latest data-fetching-demo
```

Throughout this section we will use **JSONPlaceholder** as our mock API:

```
https://jsonplaceholder.typicode.com
```

Available endpoints include:

| Endpoint | Description |
|---|---|
| `/posts` | 100 blog posts |
| `/comments` | 500 comments |
| `/albums` | 100 albums |
| `/photos` | 5000 photos |
| `/todos` | 200 todos |
| `/users` | 10 users |

---

## What's Next

The following tutorials cover practical data fetching patterns:

1. **Tutorial 67** -- Fetching data in client components with `useEffect` and `useState`
2. **Tutorial 68** -- Fetching data in server components with `async`/`await`
3. **Tutorial 69** -- Loading and error states using `loading.tsx` and `error.tsx`
4. **Tutorial 70** -- Sequential data fetching and waterfall patterns

---

## Key Takeaway

> Prefer server components for data fetching whenever possible. They offer better performance, security, and a simpler developer experience. Reserve client-side fetching for cases that genuinely require browser-side interactivity or real-time data.
