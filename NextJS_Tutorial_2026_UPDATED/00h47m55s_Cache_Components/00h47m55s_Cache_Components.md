# Cache Components

Next.js 15 introduces a powerful caching system through the `"use cache"` directive, `cacheLife()`, `cacheTag()`, and `revalidateTag()` APIs. These tools allow fine-grained control over caching at the component and function level, regardless of the data source.

## The "use cache" Directive

The `"use cache"` directive at the top of a file or function enables caching for that module or specific functions. This works with any data source -- fetch, Prisma, raw SQL, or external APIs.

### Basic Usage

```typescript
// lib/posts.ts
"use cache";

import { prisma } from '@/lib/prisma';

export async function getPosts() {
  return await prisma.post.findMany({
    include: { author: true },
  });
}
```

When `"use cache"` is at the file level, every exported function in that file uses caching. You can also scope it to specific functions:

```typescript
// lib/data.ts
import { prisma } from '@/lib/prisma';

// This function is cached
export async function getPosts() {
  "use cache";
  return await prisma.post.findMany();
}

// This function is NOT cached
export async function getUsers() {
  return await prisma.user.findMany();
}
```

## cacheLife() - Setting Time-to-Live

The `cacheLife()` function sets how long cached data should remain valid before being considered stale.

```typescript
// lib/posts.ts
"use cache";

import { cacheLife } from 'next/cache';

export async function getPosts() {
  cacheLife('hours');   // Cache for hours
  // or
  cacheLife(3600);      // Cache for 3600 seconds (1 hour)

  return await fetch('https://api.example.com/posts').then((r) => r.json());
}
```

### Predefined Cache Life Profiles

Next.js provides several predefined profiles:

| Profile     | Description                  |
|-------------|------------------------------|
| `'seconds'` | Cache for a few seconds      |
| `'minutes'` | Cache for a few minutes      |
| `'hours'`   | Cache for a few hours        |
| `'days'`    | Cache for a few days         |
| `'weeks'`   | Cache for a few weeks        |
| `'months'`  | Cache for a few months       |
| `'years'`   | Cache for years              |

You can also define custom profiles in `next.config.ts`:

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    cacheLife: {
      fast: { stale: 10, revalidate: 60 },
      slow: { stale: 3600, revalidate: 86400 },
      custom: { stale: 300, revalidate: 3600 },
    },
  },
};
```

Then use them:

```typescript
"use cache";

export async function getPosts() {
  cacheLife('fast');
  // ...
}
```

## cacheTag() - Tagging Cached Data

Tags allow you to group cached data for selective invalidation. Multiple functions can share the same tag.

```typescript
// lib/posts.ts
"use cache";

import { cacheTag } from 'next/cache';

export async function getPosts() {
  cacheTag('posts');

  return await fetch('https://api.example.com/posts').then((r) => r.json());
}

export async function getPost(id: string) {
  cacheTag('posts');

  return await fetch(`https://api.example.com/posts/${id}`).then((r) => r.json());
}
```

Both `getPosts` and `getPost` are tagged with `'posts'`. When the `'posts'` tag is revalidated, the cache for both functions is invalidated.

## revalidateTag() - On-Demand Invalidation

The `revalidateTag()` function allows you to invalidate cached data on demand, typically after a mutation.

```typescript
// app/actions.ts
"use server";

import { revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await prisma.post.create({
    data: { title, content },
  });

  // Invalidate all cached data tagged with 'posts'
  revalidateTag('posts');
}
```

## updateTag() - Updating Cache Tags

The `updateTag()` function allows you to modify tags associated with cached entries, useful for more advanced cache management scenarios:

```typescript
"use server";

import { updateTag } from 'next/cache';

export async function publishPost(postId: string) {
  // Update the tag, changing its state
  updateTag('posts:published', { postId });
}
```

## Working with Any Data Source

The caching system works identically regardless of how you fetch data. Here are examples with different data sources:

### With Prisma

```typescript
// lib/products.ts
"use cache";

import { cacheLife, cacheTag } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function getProducts() {
  cacheLife('hours');
  cacheTag('products');

  return await prisma.product.findMany({
    where: { active: true },
    include: { category: true },
  });
}
```

### With Raw SQL

```typescript
// lib/users.ts
"use cache";

import { cacheLife, cacheTag } from 'next/cache';
import { sql } from '@vercel/postgres';

export async function getActiveUsers() {
  cacheLife('minutes');
  cacheTag('users');

  const { rows } = await sql`
    SELECT id, name, email
    FROM users
    WHERE active = true
    ORDER BY created_at DESC
  `;

  return rows;
}
```

### With MongoDB

```typescript
// lib/articles.ts
"use cache";

import { cacheLife, cacheTag } from 'next/cache';
import { client } from '@/lib/mongodb';

export async function getArticles() {
  cacheLife('days');
  cacheTag('articles');

  const db = client.db('blog');
  return await db.collection('articles')
    .find({ published: true })
    .sort({ date: -1 })
    .toArray();
}
```

## Practical Example: Blog Posts with Caching

### posts.ts - Data Layer

```typescript
// lib/posts.ts
"use cache";

import { cacheLife, cacheTag } from 'next/cache';

interface Post {
  id: number;
  title: string;
  body: string;
}

export async function getPosts(): Promise<Post[]> {
  cacheLife('days');
  cacheTag('posts');

  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  return res.json();
}

export async function getPost(id: string): Promise<Post> {
  cacheLife('days');
  cacheTag('posts');

  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  return res.json();
}
```

### actions.ts - Mutation with Cache Invalidation

```typescript
// app/actions.ts
"use server";

import { revalidateTag } from 'next/cache';

export async function refreshPosts() {
  revalidateTag('posts');
}
```

### page.tsx - Consuming Cached Data

```typescript
// app/posts/page.tsx
import { getPosts } from '@/lib/posts';
import { RefreshButton } from './refresh-button';

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div>
      <h1>Posts</h1>
      <RefreshButton />
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### refresh-button.tsx - Client Component for Invalidation

```typescript
// app/posts/refresh-button.tsx
"use client";

import { refreshPosts } from '@/app/actions';

export function RefreshButton() {
  return (
    <button onClick={() => refreshPosts()}>
      Refresh Posts
    </button>
  );
}
```

## Cache Debugging

You can monitor cache behavior with headers:

```bash
curl -I http://localhost:3000/posts
# Look for x-vercel-cache: HIT | MISS | STALE
```

## Best Practices

1. **Use specific tags**: Tag data by content type (`'posts'`, `'users'`, `'products'`)
2. **Set appropriate cache lifetimes**: Match `cacheLife()` to how frequently your data changes
3. **Invalidate on mutations**: Always call `revalidateTag()` after creating, updating, or deleting data
4. **Use "use cache" at the function level**: Prefer function-level over file-level for granular control
5. **Combine with Suspense**: Wrap cached components in Suspense boundaries for streaming

## Summary

- `"use cache"` directive enables caching for functions with any data source
- `cacheLife()` sets the time-to-live for cached entries
- `cacheTag()` groups cached data under named tags
- `revalidateTag()` invalidates cached data on demand after mutations
- `updateTag()` modifies cache tags for advanced scenarios
- Works identically with fetch, Prisma, MongoDB, raw SQL, or any data source
- Provides a unified caching API that replaces ad-hoc caching solutions
