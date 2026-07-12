# SSG - Static Site Generation

Static Site Generation (SSG) is the default rendering strategy in Next.js 15 for the App Router. Pages that do not use any dynamic APIs are rendered into static HTML at build time.

## Default Behavior

In the App Router, every page is statically rendered by default **unless** it uses one or more of these dynamic APIs:

- `cookies()` from `next/headers`
- `headers()` from `next/headers`
- `searchParams` in the page component props
- `dynamic = 'force-dynamic'` in route segment config
- `revalidate = 0` or `export const revalidate = 0`
- `noStore()` from `next/cache`
- `unstable_noStore` from `next/cache`

### Simple Static Page Example

```typescript
// app/page.tsx
export default function HomePage() {
  return (
    <main>
      <h1>Welcome to my site</h1>
      <p>This page is statically rendered at build time.</p>
    </main>
  );
}
```

### Static Page with Data Fetching

```typescript
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <ul>
      {posts.map((post: { id: number; title: string }) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

In the example above, the fetch call is cached by default (Next.js caches `fetch` requests), so the page remains static. The data is fetched at build time and embedded in the HTML.

## Benefits of SSG

| Benefit           | Description                                                    |
|-------------------|----------------------------------------------------------------|
| Performance       | Static HTML is served instantly, no server processing per request |
| CDN Friendly      | Static files can be cached at the edge on CDNs                 |
| Low Server Cost   | No server-side computation per visitor                         |
| SEO               | Fully rendered HTML is available to search engine crawlers     |
| Reliability       | No database or API dependency at request time                  |
| Security          | Reduced attack surface (no server-side code execution)         |

## How to Identify SSG in Build Output

After running `npm run build`, look for the circle icon next to the route:

```
Route (app)                              Size     First Load JS
+  /                                     190 B          85.4 kB      <-- circle: static
+  /about                                150 B          84.7 kB      <-- circle: static
+  /posts                                  ?            85 kB        <-- circle: static
+  /dashboard                              ?          84.9 kB        <-- f (lambda): dynamic
```

The circle icon means the route was pre-rendered to a static HTML file during build. The lambda (f) icon means the route is rendered dynamically on each request.

## The Rendering Decision Diagram

Next.js decides the rendering strategy at build time using this logic:

```
Is the page using cookies(), headers(), searchParams, 
noStore(), or dynamic = 'force-dynamic'?
    |
    +-- YES --> Dynamic Rendering (SSR) --> Lambda icon (f)
    |
    +-- NO  --> Is there a fetch() with cache: 'no-store' 
                or revalidate: 0?
                |
                +-- YES --> Dynamic Rendering (SSR)
                |
                +-- NO  --> Is there a fetch() with revalidate > 0 
                            or generateStaticParams() used?
                            |
                            +-- YES --> ISR (Static with revalidation)
                            |           --> Filled dot icon
                            |
                            +-- NO  --> SSG (Fully Static)
                                        --> Circle icon
```

## Static Params with generateStaticParams

For dynamic routes (like `/posts/[id]`), you can use `generateStaticParams` to specify which paths should be statically generated at build time:

```typescript
// app/posts/[id]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('https://jsonplaceholder.typicode.com/posts')
    .then((res) => res.json());

  return posts.map((post: { id: number }) => ({
    id: String(post.id),
  }));
}

async function getPost(id: string) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  return res.json();
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}
```

`generateStaticParams` returns an array of `{ id: string }` objects. Each object corresponds to one path that will be statically generated. If a path is accessed that was not pre-generated, Next.js can either return a 404 or generate it on-demand (depending on configuration).

## When to Use SSG

Use Static Site Generation when:

- The content does not change frequently
- The data can be fetched at build time
- Personalization or user-specific content is not required
- Maximum performance and minimal server cost are priorities
- The site has predictable, enumerable pages (blog posts, documentation, landing pages)

## Avoiding Accidental Dynamic Rendering

Be careful with seemingly harmless imports that can trigger dynamic rendering:

```typescript
// This makes the entire route dynamic
import { cookies } from 'next/headers';

// If you only need cookies in a specific component,
// isolate it with Suspense (see Suspense and Streaming section)
```

## Summary

- SSG is the default rendering strategy in the App Router
- Pages without dynamic APIs are statically rendered at build time
- Identified by the circle icon in the build output
- Benefits include fast performance, CDN caching, and low server costs
- Use `generateStaticParams` to pre-generate dynamic route paths
- The rendering decision is based on detecting dynamic APIs
