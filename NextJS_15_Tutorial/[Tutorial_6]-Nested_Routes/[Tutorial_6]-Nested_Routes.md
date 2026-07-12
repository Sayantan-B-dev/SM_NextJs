# Nested Routes

Building on file-based routing, we can create nested routes by organizing folders hierarchically.

## Scenario 3: Blog with Nested Posts

Create a blog page with nested post routes:

```
src/
  app/
    blog/
      page.tsx
      first/
        page.tsx
      second/
        page.tsx
```

### Blog Listing Page

```typescript
// src/app/blog/page.tsx
export default function Blog() {
  return <h1>My Blog</h1>;
}
```

### Nested Blog Post Pages

```typescript
// src/app/blog/first/page.tsx
export default function FirstBlog() {
  return <h1>First Blog Post</h1>;
}
```

```typescript
// src/app/blog/second/page.tsx
export default function SecondBlog() {
  return <h1>Second Blog Post</h1>;
}
```

## Route to URL Mapping

| File Path | URL |
|-----------|-----|
| `src/app/page.tsx` | `/` |
| `src/app/blog/page.tsx` | `/blog` |
| `src/app/blog/first/page.tsx` | `/blog/first` |
| `src/app/blog/second/page.tsx` | `/blog/second` |

## Visual Structure

```
app/
  page.tsx                    ->  /
  blog/
    page.tsx                  ->  /blog
    first/
      page.tsx               ->  /blog/first
    second/
      page.tsx               ->  /blog/second
```

## Key Takeaway

Next.js mirrors your folder structure in your URLs automatically. A `page.tsx` file in a nested folder corresponds to the full URL path matching that folder hierarchy. This pattern allows you to organize related routes logically within your project structure.

## Next: Dynamic Routes

While nested routes work well for predefined paths, real applications often need to handle variable segments. That is where dynamic routes come in.
