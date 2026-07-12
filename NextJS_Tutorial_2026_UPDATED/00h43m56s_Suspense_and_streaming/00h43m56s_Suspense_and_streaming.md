# Suspense and Streaming

Suspense and streaming allow Next.js to send parts of a page to the client as they become available, rather than waiting for the entire page to render. This improves perceived performance and allows you to isolate dynamic components without making the entire route dynamic.

## The Problem: Dynamic APIs Make the Whole Route Dynamic

When you use `cookies()` or `headers()` directly in a page component, the entire route becomes dynamic:

```typescript
// app/posts/page.tsx
import { cookies } from 'next/headers';

async function getPosts() {
  const res = await fetch('https://api.example.com/posts');
  return res.json();
}

async function getRecommendations() {
  const res = await fetch('https://api.example.com/recommendations', {
    cache: 'no-store',
  });
  return res.json();
}

export default async function PostsPage() {
  const cookieStore = await cookies();  // This makes the entire page dynamic!
  const theme = cookieStore.get('theme')?.value ?? 'light';

  const posts = await getPosts();
  const recommendations = await getRecommendations();

  return (
    <div className={theme}>
      <h1>Posts</h1>
      <ul>{posts.map((p: any) => <li key={p.id}>{p.title}</li>)}</ul>
      <h2>Recommendations</h2>
      <ul>{recommendations.map((r: any) => <li key={r.id}>{r.title}</li>)}</ul>
    </div>
  );
}
```

In this example, the entire page becomes dynamic because `cookies()` is called at the top level. The posts (which could be static) and recommendations (which are dynamic anyway) both lose their caching benefits.

## The Solution: Isolate Dynamic Components with Suspense

The solution is to move the dynamic parts into separate components and wrap them in `Suspense` boundaries. This allows the static parts to remain static while only the dynamic parts are streamed.

### Refactored Example

Create a separate component for the cookie-dependent part:

```typescript
// components/ThemeWrapper.tsx
import { cookies } from 'next/headers';

export default async function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value ?? 'light';

  return <div className={theme}>{children}</div>;
}
```

Keep the static content in the page:

```typescript
// app/posts/page.tsx
import { Suspense } from 'react';
import ThemeWrapper from '@/components/ThemeWrapper';
import Recommendations from '@/components/Recommendations';

async function getPosts() {
  const res = await fetch('https://api.example.com/posts');
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <ThemeWrapper>
      <h1>Posts</h1>
      <ul>{posts.map((p: any) => <li key={p.id}>{p.title}</li>)}</ul>

      <h2>Recommendations</h2>
      <Suspense fallback={<div>Loading recommendations...</div>}>
        <Recommendations />
      </Suspense>
    </ThemeWrapper>
  );
}
```

Now the recommendations component is isolated:

```typescript
// components/Recommendations.tsx
export default async function Recommendations() {
  const res = await fetch('https://api.example.com/recommendations', {
    cache: 'no-store',
  });
  const recommendations = await res.json();

  return (
    <ul>
      {recommendations.map((r: any) => (
        <li key={r.id}>{r.title}</li>
      ))}
    </ul>
  );
}
```

### What Happens Now

1. **The posts page is still statically rendered** (no dynamic APIs at the page level)
2. **The ThemeWrapper is dynamic** (uses cookies) but only renders the theme wrapper
3. **Recommendations streams in** after the server fetches them, showing a fallback in the meantime

## Streaming HTML Chunks

When you use Suspense, Next.js streams HTML chunks to the client:

```
[Static HTML shell] --> [Suspense fallback] --> [Streamed dynamic content]
```

The browser can render the static shell immediately while waiting for dynamic parts. This is called **progressive rendering**.

### How Streaming Works

1. The server starts sending the static HTML shell immediately
2. As each Suspense boundary resolves, the server streams the HTML for that chunk
3. The client progressively renders each chunk as it arrives
4. The user sees content faster than waiting for the full page

## Suspense Boundaries and Loading States

You can nest Suspense boundaries for more granular loading states:

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';
import UserProfile from '@/components/UserProfile';
import RecentOrders from '@/components/RecentOrders';
import ActivityFeed from '@/components/ActivityFeed';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      <Suspense fallback={<div>Loading profile...</div>}>
        <UserProfile />
      </Suspense>

      <Suspense fallback={<div>Loading orders...</div>}>
        <RecentOrders />
      </Suspense>

      <Suspense fallback={<div>Loading activity...</div>}>
        <ActivityFeed />
      </Suspense>
    </div>
  );
}
```

Each section loads independently and streams to the client as it becomes ready.

## Practical Example: Blog with Comments

```typescript
// app/blog/[slug]/page.tsx
import { Suspense } from 'react';
import Comments from '@/components/Comments';

async function getPost(slug: string) {
  const res = await fetch(`https://api.example.com/posts/${slug}`);
  return res.json();
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>

      <Suspense fallback={<div>Loading comments...</div>}>
        <Comments postId={post.id} />
      </Suspense>
    </article>
  );
}
```

```typescript
// components/Comments.tsx
import { cookies } from 'next/headers';

export default async function Comments({ postId }: { postId: string }) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionId')?.value;

  // Simulate slow data fetch
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const comments = await fetch(
    `https://api.example.com/posts/${postId}/comments`,
    { cache: 'no-store' }
  ).then((r) => r.json());

  return (
    <div>
      <h2>Comments</h2>
      <ul>
        {comments.map((c: { id: number; text: string }) => (
          <li key={c.id}>{c.text}</li>
        ))}
      </ul>
    </div>
  );
}
```

Here, the blog post body renders immediately (statically if no dynamic APIs are used), while comments stream in after a 2-second simulated delay.

## Advanced: Using loading.js as an Automatic Suspense Boundary

Next.js provides a convention-based approach: `loading.js` files act as Suspense boundaries for route segments.

```typescript
// app/blog/[slug]/loading.tsx
export default function Loading() {
  return <div>Loading blog post...</div>;
}
```

This wraps the page component in an automatic Suspense boundary, but for more granular control, manual Suspense boundaries are preferred.

## Performance Benefits

| Without Streaming                     | With Streaming                          |
|---------------------------------------|-----------------------------------------|
| User waits for all data to load       | User sees static shell immediately      |
| Time To First Byte (TTFB) is higher   | TTFB includes only the static shell     |
| Largest Contentful Paint (LCP) is delayed | LCP can improve significantly       |
| All-or-nothing loading experience     | Progressive, incremental rendering      |

## Summary

- Dynamic APIs like `cookies()` and `headers()` make routes dynamic
- Isolate dynamic components into separate files wrapped with `Suspense`
- Use `Suspense` with a `fallback` to show loading states for dynamic parts
- Streaming sends HTML chunks progressively to the client
- Static parts of the page remain static even when dynamic parts stream in
- This pattern maximizes caching while still supporting personalization
