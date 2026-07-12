# Dynamic Routes, Params, and Search Params in Next.js

Dynamic routes allow you to create pages with variable segments in the URL path. Combined with search parameters, they form the foundation of data-driven pages in Next.js.

## `[param]` Folders for Dynamic Routes

Create a folder with square brackets to define a dynamic route segment. The folder name becomes the parameter name.

```
app/
  posts/
    [id]/
      page.tsx   --> matches /posts/1, /posts/abc, /posts/hello
```

## `params` as Promise in Next.js 15

In Next.js 15, `params` is a Promise that must be awaited. This change improves SSR performance by allowing the server to stream the page before params are resolved.

```tsx
// app/posts/[id]/page.tsx
type PostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  return <div>Post ID: {id}</div>;
}
```

## Accessing `params`

Always await the `params` promise before accessing its properties:

```tsx
export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const post = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
    .then((res) => res.json());

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}
```

## `searchParams` Prop

The `searchParams` prop is also a Promise in Next.js 15 and contains the query string parameters of the URL.

```tsx
// app/posts/page.tsx
type PostsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { search } = await searchParams;
  const query = search || "";

  const posts = await fetch("https://jsonplaceholder.typicode.com/posts")
    .then((res) => res.json());

  const filtered = query
    ? posts.filter((p: { title: string }) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      )
    : posts;

  return (
    <div>
      <form>
        <input type="text" name="search" defaultValue={query} />
        <button type="submit">Search</button>
      </form>
      <ul>
        {filtered.map((post: { id: number; title: string }) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Type Definitions

Define clear types for both params and searchParams to ensure type safety:

```ts
// For a dynamic route page:
type PageProps = {
  params: Promise<{ id: string; slug?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
```

## `generateStaticParams` for Static Site Generation

Use `generateStaticParams` to pre-render pages at build time for known dynamic routes:

```tsx
// app/posts/[id]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch("https://jsonplaceholder.typicode.com/posts")
    .then((res) => res.json());

  return posts.slice(0, 10).map((post: { id: number }) => ({
    id: post.id.toString(),
  }));
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // ...
}
```

This generates static HTML for posts with IDs 1 through 10 at build time.

## Catch-All Routes `[...slug]`

To match multiple path segments, use `[...slug]`:

```
app/
  docs/
    [...slug]/
      page.tsx   --> matches /docs, /docs/guide, /docs/guide/getting-started
```

```tsx
// app/docs/[...slug]/page.tsx
export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  if (!slug) {
    return <div>Docs Home</div>;
  }

  return <div>Docs: {slug.join(" / ")}</div>;
}
```

## What is a Slug?

A slug is a human-readable, URL-friendly identifier for a resource. For example, in `/posts/hello-world`, `hello-world` is the slug. In Next.js, slugs are accessed through dynamic route parameters.

## Practical Example: Post Detail with Search Params Filter

```tsx
// app/posts/[id]/page.tsx
type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ highlight?: string }>;
};

export default async function PostDetail({ params, searchParams }: Props) {
  const { id } = await params;
  const { highlight } = await searchParams;

  const post = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  ).then((r) => r.json());

  return (
    <article>
      <h1 style={{ background: highlight === "true" ? "yellow" : "none" }}>
        {post.title}
      </h1>
      <p>{post.body}</p>
      <p>Post #{id}</p>
    </article>
  );
}
```

## Best Practices

1. **Always await `params` and `searchParams`** -- they are Promises in Next.js 15.
2. **Use `generateStaticParams`** for content that does not change frequently.
3. **Validate dynamic params** -- fetch data inside the page and call `notFound()` if the resource does not exist.
4. **Use catch-all routes sparingly** -- prefer explicit route segments for better predictability.
5. **Type your props** for better developer experience and type safety.
