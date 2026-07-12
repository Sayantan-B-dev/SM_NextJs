# Introduction

## What is Next.js?

Next.js is a **React framework** for building full-stack web applications. While React is a library for building user interfaces that handles only the view layer, Next.js extends React with additional features needed for production-ready applications.

### React vs Next.js

| Feature | React (alone) | Next.js |
|---------|--------------|---------|
| Routing | Requires third-party packages | File-based routing built in |
| API Routes | External backend required | Built-in API route support |
| Rendering | Client-side only | Server-side and client-side options |
| Data Fetching | Manual setup | Built-in async/await support |
| Bundling | Requires separate tooling | Automatic |
| Production Optimizations | Manual configuration | Built-in for images, fonts, scripts |

Next.js provides opinions and conventions that have emerged from years of experience building React apps in production. These conventions simplify development and reduce configuration overhead.

## Why Learn Next.js?

Next.js simplifies building production-ready web applications with these out-of-the-box features:

- **Routing** -- File-based routing eliminates the need to install and configure third-party routing packages. Routes are automatically generated from your file structure.
- **API Routes** -- Build both frontend React components and backend APIs within the same Next.js application, enabling seamless integration between frontend and backend code.
- **Rendering Flexibility** -- Supports both server-side rendering (SSR) and client-side rendering (CSR), leading to improved performance and better search engine optimization.
- **Streamlined Data Fetching** -- Built-in async/await support in React components makes data fetching straightforward and efficient.
- **Styling Flexibility** -- Supports CSS Modules, Tailwind CSS, and CSS-in-JS solutions.
- **Optimizations** -- Built-in optimizations for images, fonts, and scripts improve Core Web Vitals and user experience.
- **Optimized Build System** -- Focus on writing code instead of dealing with complex configurations.

## Prerequisites

Before starting this course, you should have knowledge of:

- HTML, CSS, and modern JavaScript
- React fundamentals: function components, props, state, JSX, and hooks
- TypeScript basics (recommended but not required)

## Course Overview

Throughout this course, we will build applications from the ground up, exploring all key concepts in Next.js. We focus on **version 15 and above**. Source code is available in the accompanying GitHub repository.

### Key Topics Covered

- File-based routing (static, dynamic, nested, and catch-all routes)
- Layouts, templates, and loading UI
- Error handling strategies
- Server and client components
- Data fetching patterns
- Route handlers and middleware
- Authentication and authorization
- Deployment

Let's begin by creating our first Next.js application.
