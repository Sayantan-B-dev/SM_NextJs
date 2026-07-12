# Routing

Next.js uses a **file-system-based routing system**. The URLs in your browser are determined by how you organize files and folders in your code.

## Route Conventions

Three main conventions govern routing in Next.js:

1. **All routes must live inside the `app` folder**
2. **Route files must be named `page.tsx`** (or `page.js` for JavaScript)
3. **Each folder represents a URL path segment**

When these conventions are followed, the file automatically becomes available as a route.

## Scenario 1: Creating a Home Page

Create the following structure:

```
src/
  app/
    page.tsx
```

```typescript
// src/app/page.tsx
export default function Home() {
  return <h1>Welcome Home</h1>;
}
```

The `page.tsx` file inside the `app` folder maps to the **root URL** (`/`).

## Scenario 2: Adding More Routes

To create `/about` and `/profile` routes:

```
src/
  app/
    page.tsx
    about/
      page.tsx
    profile/
      page.tsx
```

```typescript
// src/app/about/page.tsx
export default function About() {
  return <h1>About Me</h1>;
}
```

```typescript
// src/app/profile/page.tsx
export default function Profile() {
  return <h1>My Profile</h1>;
}
```

## How Routes Map to URLs

| File Path | URL |
|-----------|-----|
| `src/app/page.tsx` | `/` |
| `src/app/about/page.tsx` | `/about` |
| `src/app/profile/page.tsx` | `/profile` |

Each folder name becomes a segment in the URL path.

## 404 Handling

If a user visits a URL that does not match any file in your `app` folder (e.g., `/dashboard`), Next.js automatically serves a **404 Not Found** response without requiring any special code.

## Folder Structure Visualization

```
src/app/
  page.tsx        ->  /
  about/
    page.tsx      ->  /about
  profile/
    page.tsx      ->  /profile
```

## Key Takeaways

- Pages are created by adding a `page.tsx` file inside a folder
- The folder name determines the URL segment
- Nesting folders creates nested URL paths
- No need to install or configure third-party routing packages
- Non-existent routes automatically return 404

This file-based approach is a core example of Next.js's philosophy of favoring conventions over configuration.
