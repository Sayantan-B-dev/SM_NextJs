# Sequential Data Fetching

## Overview

Sequential data fetching occurs when one fetch request depends on the result of another. This creates a "waterfall" pattern where each request must wait for the previous one to complete. While this can lead to longer loading times, it is sometimes unavoidable because the data for one request is only available after a prior request resolves.

---

## Use Case: Blog Posts with Authors

Consider a blog page that displays posts and their authors:

1. First, fetch all posts from `/posts`
2. For each post, fetch the author from `/users/:userId`

The author fetch depends on the `userId` from each post -- this is sequential by nature.

---

## Example Implementation

### Step 1: Define Types

```tsx
// app/posts-sequential/page.tsx
type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};
```

### Step 2: Create the Author Component

```tsx
// app/posts-sequential/Author.tsx
type Author = {
  id: number;
  name: string;
};

export async function Author({ userId }: { userId: number }) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );
  const author: Author = await response.json();

  return <span className="text-gray-500">{author.name}</span>;
}
```

### Step 3: Implement the Sequential Fetching Page

```tsx
// app/posts-sequential/page.tsx
import { Author } from "./Author";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export default async function PostsSequential() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts: Post[] = await response.json();

  const filteredPosts = posts.filter((post) => post.id % 10 === 0);

  return (
    <div>
      {filteredPosts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
          <Author userId={post.userId} />
          <hr />
        </div>
      ))}
    </div>
  );
}
```

---

## The Waterfall Pattern

The data flow looks like this:

```
1. Fetch /posts           <-- 100 posts returned
     |
     v
2. For each post (e.g., 10 posts):
     Fetch /users/1       <-- waits for post data
     Fetch /users/2       <-- waits for post data
     Fetch /users/3       <-- waits for post data
     ...
```

Each author request has to wait for the post request to complete because the `userId` comes from each individual post.

---

## Mitigating the Waterfall with Streaming

You can improve user experience by wrapping the dependent component in a `<Suspense>` boundary. This streams the posts immediately and shows a loading indicator for the authors.

```tsx
// app/posts-sequential/page.tsx
import { Suspense } from "react";
import { Author } from "./Author";

export default async function PostsSequential() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts: Post[] = await response.json();

  const filteredPosts = posts.filter((post) => post.id % 10 === 0);

  return (
    <div>
      {filteredPosts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
          <Suspense fallback={<div className="text-gray-400">Loading author...</div>}>
            <Author userId={post.userId} />
          </Suspense>
          <hr />
        </div>
      ))}
    </div>
  );
}
```

### Result

1. Posts render immediately
2. "Loading author..." text appears below each post
3. After the 1-second delay, each author name streams in progressively

---

## Sequential vs Parallel Fetching

| Aspect | Sequential | Parallel |
|---|---|---|
| Dependency | One fetch depends on another | Fetches are independent |
| Total time | Sum of all request times | Maximum of all request times |
| Use case | Post -> Author, User -> Orders | Dashboard with multiple widgets |
| Streaming | Can mitigate with `Suspense` | All data arrives at once (or streaming) |

---

## Best Practices

| Practice | Description |
|---|---|
| Use `Suspense` boundaries | Stream non-blocking content immediately |
| Identify dependencies | Be explicit about which fetches depend on which |
| Consider parallel alternatives | Use `Promise.all()` when fetches are independent |
| Show meaningful fallbacks | Loading indicators should communicate what is loading |
| Avoid deep waterfalls | Minimize the number of sequential fetch layers |

---

## When Sequential Fetching Is Appropriate

- **Necessary data dependency**: When request B requires data from request A
- **User-initiated sequences**: Search results then detail views
- **Authentication flows**: Fetch user profile, then use profile data for further requests

---

## Key Takeaway

> Sequential data fetching creates a waterfall where each request waits for the previous one. While sometimes unavoidable, you can mitigate the user experience impact by wrapping dependent fetches in `<Suspense>` boundaries, allowing independent content to render immediately while dependent data streams in progressively.
