# Parallel Data Fetching

## Overview

Parallel data fetching allows multiple independent data requests to be initiated simultaneously, reducing total load time. In Next.js, requests in a route are eagerly initiated and load concurrently when structured correctly.

## Sequential vs Parallel Fetching

| Approach | Behavior | Total Time (2 requests, 1s each) |
|----------|----------|----------------------------------|
| Sequential | Request B starts after Request A completes | ~2 seconds |
| Parallel | Both requests start at the same time | ~1 second |

## Key Pattern: Initiate Before Await

The critical technique for parallel fetching is to **initiate all requests before awaiting any of them**. An `await` expression inside a component blocks subsequent code from executing.

```typescript
// Sequential (slow) - B waits for A
const posts = await getPosts(userId);
const albums = await getAlbums(userId); // starts after posts finish

// Parallel (fast) - both start simultaneously
const postsPromise = getPosts(userId);
const albumsPromise = getAlbums(userId);
const [posts, albums] = await Promise.all([postsPromise, albumsPromise]);
```

## Implementation

### Project Structure

```
app/
  user-parallel/
    [id]/
      page.tsx
      loading.tsx
```

### Types and Fetch Functions

```typescript
// types
type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type Album = {
  userId: number;
  id: number;
  title: string;
};
```

```typescript
// fetch functions
async function getUserPosts(userId: string): Promise<Post[]> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
  );
  return res.json();
}

async function getUserAlbums(userId: string): Promise<Album[]> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/albums?userId=${userId}`
  );
  return res.json();
}
```

### Page Component

```typescript
// app/user-parallel/[id]/page.tsx
type Props = {
  params: Promise<{ id: string }>;
};

export default async function UserProfile({ params }: Props) {
  const { id: userId } = await params;

  // Initiate both requests before awaiting
  const postsData = getUserPosts(userId);
  const albumsData = getUserAlbums(userId);

  // Await both in parallel
  const [posts, albums] = await Promise.all([postsData, albumsData]);

  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Posts</h2>
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="mb-2 p-2 border rounded">
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-gray-600">{post.body}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Albums</h2>
        <ul>
          {albums.map((album) => (
            <li key={album.id} className="mb-2 p-2 border rounded">
              <h3 className="font-semibold">{album.title}</h3>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

### Loading State

```typescript
// app/user-parallel/[id]/loading.tsx
export default function Loading() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
    </div>
  );
}
```

## Adding Simulated Latency

To verify parallel behavior, add delays to your fetch functions:

```typescript
async function getUserPosts(userId: string): Promise<Post[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
  );
  return res.json();
}
```

With two 1-second delays, parallel fetching completes in ~1 second total instead of ~2 seconds.

## Best Practices

- **Identify independent requests**: If Request B does not depend on data from Request A, fetch them in parallel.
- **Use `Promise.all`**: Collect all promises into an array for concurrent resolution.
- **Use `loading.tsx`**: Provides immediate feedback while parallel requests resolve.
- **Avoid waterfall requests**: An `await` in the component body blocks subsequent code. Always initiate promises first.

## Summary

Parallel data fetching reduces total load time by initiating independent requests concurrently. The key pattern is to call all fetch functions before awaiting any of them, using `Promise.all` to resolve the batch. This technique is especially useful for dashboard pages, profile pages, or any view displaying data from multiple independent sources.
