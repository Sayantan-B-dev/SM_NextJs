# Revalidation and Cache Invalidation

Next.js provides a powerful caching layer that automatically caches data, rendered output, and route segments. When data changes (e.g., a new blog post is created), you must tell Next.js to purge the stale cache and re-fetch fresh data. Two primary APIs handle this: `revalidatePath()` and `revalidateTag()`. A third utility, `updateTag()`, extends tag-based cache management.

---

## 1. Understanding Next.js Caching Layers

Before diving into revalidation, understand what is cached:

| Cache Layer | Location | What It Caches |
|---|---|---|
| Data Cache | Server | Results of `fetch()` and database calls |
| Full Route Cache | Server | Static HTML and RSC payload for routes |
| Router Cache | Browser (client) | RSC payload for navigation |

Revalidation APIs let you purge specific entries from the Data Cache and Full Route Cache, ensuring users see up-to-date content.

---

## 2. `revalidatePath()` -- Path-Based Revalidation

`revalidatePath()` purges the cache for a specific route or set of routes. Use it when you know which URL paths have become stale.

### Syntax

```typescript
import { revalidatePath } from 'next/cache';

revalidatePath(path: string, type?: 'page' | 'layout');
```

- `path` -- the URL path to revalidate (e.g., `/posts`, `/posts/1`).
- `type` -- optional. `'page'` (default) revalidates the page segment; `'layout'` revalidates the layout and all child pages.

### Example: Revalidate After Creating a Post

```typescript
// app/actions.ts (Server Action)
'use server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await db.post.create({ data: { title, content } });

  // Purge the /posts page cache so it re-fetches
  revalidatePath('/posts');
  // Also purge the home page if it shows recent posts
  revalidatePath('/');
}
```

### Example: Revalidate a Specific Post Detail Page

```typescript
export async function updatePost(id: string, data: { title: string }) {
  await db.post.update({ where: { id }, data });

  // Only this post's page needs revalidation
  revalidatePath(`/posts/${id}`);
}
```

### Example: Revalidate in a Route Handler

```typescript
// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const body = await request.json();
  // ... save to database

  revalidatePath('/posts');
  return NextResponse.json({ success: true });
}
```

### Important: `revalidatePath()` Must Be Called in a Server Context

It works inside:
- Server Actions (`'use server'`)
- Route Handlers (route.ts)
- `getServerSideProps` (Pages Router, legacy)

It does **not** work in client components directly.

---

## 3. `revalidateTag()` -- Tag-Based Revalidation

Tags provide a more granular approach. Instead of purging by URL path, you attach one or more tags to cached data and revalidate by tag. This is especially useful when a single piece of data appears on multiple pages.

### Step 1: Assign Tags During Fetch

```typescript
// app/lib/data.ts
export async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'] }, // attach a tag
  });
  return res.json();
}

export async function getPost(id: string) {
  const res = await fetch(`https://api.example.com/posts/${id}`, {
    next: { tags: [`post-${id}`, 'posts'] },
  });
  return res.json();
}
```

If you are using a database directly (not `fetch`), wrap the call with `unstable_cache` and provide tags:

```typescript
import { unstable_cache } from 'next/cache';

export const getPosts = unstable_cache(
  async () => {
    return db.post.findMany();
  },
  ['posts-list'],
  { tags: ['posts'] }
);
```

### Step 2: Revalidate by Tag

```typescript
import { revalidateTag } from 'next/cache';

export async function createPost(formData: FormData) {
  // ... create in database

  // Revalidate ALL data tagged with 'posts'
  revalidateTag('posts');
}
```

### Step 3: Multiple Tags, Flexible Invalidation

```typescript
// Fetch user + posts together
const res = await fetch('https://api.example.com/dashboard', {
  next: { tags: ['user', 'posts'] },
});

// Later, in an action:
revalidateTag('posts'); // Invalidates only the posts part
// or
revalidateTag('user');  // Invalidates only the user part
```

---

## 4. `updateTag()` -- Refreshing Cache Tags

`updateTag()` (available in Next.js 14+) is a lower-level utility that lets you refresh the timestamp associated with a cache tag, effectively invalidating it without needing a request context.

```typescript
import { updateTag } from 'next/cache';

// In a server action or route handler:
updateTag('posts');
```

It works similarly to `revalidateTag()` but can be useful when you are building a custom cache layer or need to coordinate cache invalidation across multiple services.

---

## 5. `revalidatePath()` vs `revalidateTag()`: When to Use Each

| Scenario | Use |
|---|---|
| A single route's data changed (e.g., `/posts`) | `revalidatePath('/posts')` |
| A layout and all its children changed | `revalidatePath('/dashboard', 'layout')` |
| Data from a shared source changed (e.g., API that feeds many pages) | `revalidateTag('posts')` |
| You don't know which pages use the data | `revalidateTag(...)` is safer |
| Performance-critical revalidation | `revalidateTag(...)` is more targeted |
| A CMS webhook fires telling you content changed | `revalidateTag(tagFromCms)` or `revalidatePath(pathFromCms)` |

**Best practice**: Prefer `revalidateTag()` when data is shared across multiple routes. Prefer `revalidatePath()` when only one specific route is affected.

---

## 6. Complete Example Flow

### Use Case: Blog with Server Actions

```typescript
// app/actions.ts
'use server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  // 1. Insert into database
  const post = await db.post.create({ data: { title, content } });

  // 2. Revalidate the posts list page (by path)
  revalidatePath('/posts');

  // 3. If tags were used to fetch posts, revalidate by tag too
  revalidateTag('posts');

  // 4. Revalidate the home page if it shows recent posts
  revalidatePath('/');

  return { success: true, id: post.id };
}

export async function deletePost(id: string) {
  await db.post.delete({ where: { id } });

  // Revalidate both the list page and the individual post (which now 404s)
  revalidatePath('/posts');
  revalidatePath(`/posts/${id}`);
}
```

### Use Case: CMS Webhook (Route Handler)

```typescript
// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-webhook-secret');
  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { event, slug, tag } = body;

  if (event === 'post.updated' && slug) {
    revalidatePath(`/posts/${slug}`);
    revalidateTag('posts');
  }

  if (event === 'post.deleted' && tag) {
    revalidateTag(tag); // e.g., 'posts'
  }

  return NextResponse.json({ revalidated: true });
}
```

---

## 7. On-Demand Revalidation with `isr` (Incremental Static Regeneration)

For statically rendered pages, you can also use `revalidate` in the fetch options or `generateStaticParams`:

```typescript
// app/posts/[id]/page.tsx
export const revalidate = 60; // Revalidate at most every 60 seconds
```

But for instant invalidation, use `revalidatePath()` / `revalidateTag()`.

---

## 8. Common Pitfalls

| Pitfall | Solution |
|---|---|
| Calling `revalidatePath()` in a client component | Move it to a Server Action or Route Handler |
| Forgetting to revalidate parent layouts | Pass `'layout'` as second argument to `revalidatePath()` |
| Over-revalidating (e.g., every request) | Structure tag hierarchy thoughtfully; use targeted tags |
| Tags not matching | Ensure tag strings are identical (case-sensitive) |
| `revalidatePath()` has no effect on Router Cache | Router Cache is client-side; use `router.refresh()` if needed |

---

## 9. Summary

- `revalidatePath(path)` -- purge cache for a specific URL route.
- `revalidateTag(tag)` -- purge all cached data that has a given tag.
- Use tags when data is shared across pages; use path when only one route changed.
- Both APIs must run in a server-only context (Server Actions or Route Handlers).
- Combine with `fetch()` `next.tags` or `unstable_cache` for full control.
