# Rendering

## Introduction

Rendering is the process of transforming the React component code you write into user interfaces that users can see and interact with. The challenge of building a performant application lies in deciding **when** and **where** this transformation happens.

## Why Rendering Matters

Different rendering strategies affect:

| Factor | Impact |
|---|---|
| Initial page load | How quickly users see content |
| SEO | Whether search engines can index your content |
| Interactivity | How fast users can interact with the page |
| Server load | How much processing happens on the server vs client |

## Overview of Rendering Strategies

Next.js supports multiple rendering strategies, each with different trade-offs:

| Strategy | Where HTML is generated | When |
|---|---|---|
| **CSR** (Client-Side Rendering) | Browser | After JS loads |
| **SSR** (Server-Side Rendering) | Server | On each request |
| **SSG** (Static Site Generation) | Server | At build time |
| **ISR** (Incremental Static Regeneration) | Server | At build time + on-demand |
| **RSC** (React Server Components) | Server | On each request (streamed) |

## The React Rendering Foundation

Next.js is built on top of React. Understanding React's rendering model is essential before diving into Next.js-specific strategies.

### React's Core Rendering Steps

1. **Render phase** -- React calls your component functions and builds a virtual DOM tree
2. **Reconciliation** -- React compares the new virtual DOM with the previous one
3. **Commit phase** -- React applies the minimal set of DOM mutations

```
Component Code        Render Phase        Reconciliation        Commit Phase
  <App>                 Virtual DOM        Diff old vs new        DOM Updates
    <Header />          ├── Header         ├── Same: keep         ├── Add
    <Main />            ├── Main           ├── Changed: update    ├── Remove
    <Footer />          └── Footer         └── New: insert        └── Modify
```

## What We Will Cover

This section explores how rendering has evolved in React and Next.js:

1. **Client-Side Rendering (CSR)** -- The original SPA approach
2. **Server-Side Rendering (SSR)** -- Rendering HTML on the server
3. **Suspense SSR** -- React 18's streaming and selective hydration
4. **React Server Components (RSC)** -- The modern Next.js default

## Prerequisites

- Basic React knowledge (components, state, effects)
- Understanding of the DOM and browser APIs
- Familiarity with Next.js routing

## Note

Some concepts may not fully click on the first read. Feel free to revisit sections as needed. These architectural patterns build on each other, and understanding the trade-offs takes time.

## Related Topics

- Client-side Rendering (CSR)
- Server-side Rendering (SSR)
- Suspense SSR
