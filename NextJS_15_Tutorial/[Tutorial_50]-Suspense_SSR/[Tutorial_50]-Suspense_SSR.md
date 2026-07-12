# Suspense SSR

## Introduction

React 18 introduced **Suspense SSR**, a new architecture that overcomes the all-or-nothing waterfall problem of traditional SSR. It unlocks two game-changing features:

1. **HTML Streaming** on the server -- send HTML as it is rendered
2. **Selective Hydration** on the client -- hydrate components as their code loads

## The SSR Waterfall Problem

Traditional SSR forces a strict sequence:

```
Step 1: Fetch ALL data    |---------------------------|
Step 2: Render ALL HTML   |---------------------------|
Step 3: Send ALL at once  |---------------------------|
Step 4: Load ALL JS       |---------------------------|
Step 5: Hydrate ALL       |---------------------------|
                                TOTAL: Slowest component
                                       sets the pace
```

Every component must wait for the slowest component to finish before anything ships to the client.

## Suspense SSR Architecture

Suspense SSR breaks this waterfall by allowing the server to **stream** HTML as it becomes available and the client to **selectively hydrate** components.

### HTML Streaming

When you wrap a component in `<Suspense>`, you tell React: "Do not wait for this part. Start streaming the rest of the page."

```tsx
import { Suspense } from "react";

async function MainContent() {
  const data = await fetch("https://api.example.com/slow-data");
  const posts = await data.json();

  return (
    <div>
      {posts.map((post) => (
        <article key={post.id}>{post.title}</article>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <html>
      <body>
        <header>
          <h1>My Blog</h1>
          <nav>...</nav>
        </header>
        <Suspense fallback={<div>Loading posts...</div>}>
          <MainContent />
        </Suspense>
        <footer>Footer content</footer>
      </body>
    </html>
  );
}
```

### Streaming Flow

```
Traditional SSR:
[Fetch & Render All] ----------> [Send All] ----------> [Hydrate All]

Suspense SSR:
[Shell HTML]  ----------> Streams immediately
[MainContent] ----------> Streams when ready
[Footer]      ----------> Streams immediately
```

### Visual: What the User Sees

```
Time --> |----------------------------|

Traditional SSR:
          |---- Fetch & Render ----| Show |
                                     ^
                                     User waits for everything

Suspense SSR:
          | Shell | Loading... | Full Page |
                   ^              ^
                   Content streams as ready
```

The user sees the shell (header, nav, footer) right away, a loading spinner for the slow main content, and then the main content streams in when ready.

## Selective Hydration

On the client side, Suspense SSR enables selective hydration. Components hydrate independently as their JavaScript loads.

```
All JS loaded at once (Traditional):
  [Header] [Main] [Sidebar] [Footer]
  Wait for ALL JS --> Hydrate ALL --> Interactive

Selective Hydration (Suspense SSR):
  [Header]   (hydrated immediately)
  [Main]     (hydrated when data & JS ready)
  [Sidebar]  (hydrated when JS ready)
  [Footer]   (hydrated immediately)
```

### Key Behavior

- Components outside `<Suspense>` hydrate first and become interactive quickly
- The browser can interact with already-hydrated parts while others are still hydrating
- React prioritizes hydrating the components the user is interacting with

```tsx
import { Suspense } from "react";

async function Sidebar() {
  const items = await fetch("https://api.example.com/sidebar");
  return <nav>...</nav>;
}

async function Comments() {
  const comments = await fetch("https://api.example.com/comments");
  return <section>...</section>;
}

export default function Page() {
  return (
    <div>
      <header> <!-- Hydrates first -->
        <input type="search" placeholder="Search..." />
      </header>
      <Suspense fallback={<div>Loading sidebar...</div>}>
        <Sidebar /> <!-- Hydrates when ready -->
      </Suspense>
      <main>
        <h1>Post Title</h1> <!-- Immediate content -->
        <Suspense fallback={<div>Loading comments...</div>}>
          <Comments /> <!-- Hydrates independently -->
        </Suspense>
      </main>
    </div>
  );
}
```

## Suspense SSR vs Traditional SSR

| Aspect | Traditional SSR | Suspense SSR |
|---|---|---|
| HTML delivery | All at once | Streamed incrementally |
| Waiting for data | Blocks entire page | Only blocks wrapped section |
| Hydration | All components together | Selective per component |
| Interactivity | After full hydration | Partial as components hydrate |
| User experience | All or nothing | Progressive enhancement |

## Benefits

- **Faster Time to First Byte (TTFB)** -- shell HTML streams immediately
- **Faster First Contentful Paint (FCP)** -- content appears progressively
- **Faster Time to Interactive (TTI)** -- interactive parts work before slow parts finish
- **Better perceived performance** -- users see progress instead of a blank page
- **Granular loading states** -- each Suspense boundary can have its own fallback

## Key Points

- Use `<Suspense>` to wrap components that depend on slow data or heavy code
- React streams HTML for each Suspense boundary as it becomes ready
- Selective hydration allows interactivity on already-hydrated parts
- Components hydrate in order of user interaction priority
- Suspense SSR is the foundation for React Server Components (RSC)
- No additional configuration needed -- works out of the box in Next.js

## Related Topics

- Server-side Rendering (SSR)
- Client-side Rendering (CSR)
- Rendering Overview
