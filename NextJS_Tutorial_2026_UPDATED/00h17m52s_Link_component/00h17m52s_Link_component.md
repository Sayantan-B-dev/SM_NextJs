# Link Component in Next.js

The `Link` component from `next/link` is the primary way to handle client-side navigation between pages in a Next.js application. It extends the native HTML `<a>` element with powerful prefetching and routing capabilities.

## Why Link Over `<a>`

Using `<a>` tags triggers a full page reload, losing client-side state and causing the browser to re-download all assets. `Link` performs client-side navigation, which:

- Fetches only the new page's content without reloading shared layouts
- Preserves React component state and application state
- Enables smooth transitions and prefetching
- Works with the browser's back/forward navigation seamlessly

```tsx
// Instead of this (full page reload):
<a href="/posts">Posts</a>

// Use this (client-side navigation):
import Link from "next/link";

<Link href="/posts">Posts</Link>
```

## The `href` Prop

The `href` prop accepts a string path or a URL object. It is the only required prop.

```tsx
<Link href="/">Home</Link>
<Link href="/posts">Posts</Link>
<Link href="/posts/123">Post 123</Link>
<Link href={{ pathname: "/posts/[id]", query: { id: "123" } }}>Post 123</Link>
```

## Prefetch Behavior (`prefetch` prop)

By default, Next.js prefetches Link targets that are visible in the viewport. This happens when the Link component renders in the initial load or becomes visible during scrolling.

| Value | Behavior |
|---|---|
| `true` (default) | Prefetches the linked page's data and static assets in the background. Pages load instantly on click. |
| `false` | No prefetching occurs. The page is fetched only when the user clicks the link. Suitable for rarely visited routes. |

### Tradeoffs

- **prefetch={true}**: Faster page transitions, but increases bandwidth usage and server load for prefetched pages.
- **prefetch={false}**: Saves bandwidth for infrequently visited pages, but introduces a slight delay on navigation.

```tsx
<Link href="/posts" prefetch={true}>Posts (prefetched)</Link>
<Link href="/analytics" prefetch={false}>Analytics (no prefetch)</Link>
```

## The `replace` Prop

When `replace` is `true`, clicking the link replaces the current history entry instead of pushing a new one. This means the user cannot use the browser's back button to return to the previous page.

```tsx
<Link href="/dashboard" replace>Dashboard (replaces current history)</Link>
```

## The `scroll` Prop

By default, Next.js scrolls to the top of the page on navigation. Set `scroll={false}` to preserve the scroll position.

```tsx
<Link href="/posts" scroll={false}>Posts (preserve scroll position)</Link>
```

## Active Link Styling with `usePathname()`

To highlight the currently active link in a navigation menu, use the `usePathname()` hook from `next/navigation`.

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav>
      <Link href="/" className={pathname === "/" ? "active" : ""}>Home</Link>
      <Link href="/posts" className={pathname.startsWith("/posts") ? "active" : ""}>Posts</Link>
      <Link href="/about" className={pathname === "/about" ? "active" : ""}>About</Link>
    </nav>
  );
}
```

## Link in Navigation Menus

Typically, you create a shared layout component that includes your navigation with multiple Link components. The `Link` component does not need a `<a>` child -- it renders one automatically.

```tsx
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  return (
    <nav>
      {links.map((link) => (
        <Link key={link.href} href={link.href}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
```

## Link with Dynamic Routes

Dynamic routes use bracket syntax (`[param]`) in folder names. To create links to dynamic pages, build the `href` string or use the URL object form.

```tsx
// posts/[id]/page.tsx exists
// Generate links to individual posts:

<Link href={`/posts/${post.id}`}>{post.title}</Link>

// Or using URL object:
<Link href={{ pathname: "/posts/[id]", params: { id: post.id } }}>
  {post.title}
</Link>
```

## Linking to Dynamic Routes from a List

When rendering a list of items, each item typically links to its detail page:

```tsx
export default async function PostsList() {
  const posts = await fetch("https://jsonplaceholder.typicode.com/posts")
    .then((res) => res.json());

  return (
    <ul>
      {posts.slice(0, 20).map((post: { id: number; title: string }) => (
        <li key={post.id}>
          <Link href={`/posts/${post.id}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
}
```

## Performance Considerations

- Links visible in the viewport are prefetched automatically after the page loads.
- Large menus with many links may benefit from `prefetch={false}` on less important routes.
- The `Link` component supports the `scroll` and `replace` props to fine-tune navigation behavior.
- Prefetching only downloads the page data (RSC payload), not JavaScript bundles, making it lightweight.
