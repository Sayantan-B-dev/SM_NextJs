# params and searchParams

## Overview

In Next.js 15, `params` and `searchParams` are asynchronous props provided to page components. They allow you to access dynamic route segments and URL query strings respectively.

For a given URL like `/articles/breaking-news-123?language=en`:
- **`params`**: A promise that resolves to an object containing dynamic route parameters (e.g., `{ articleId: "breaking-news-123" }`)
- **`searchParams`**: A promise that resolves to an object containing query string parameters (e.g., `{ language: "en" }`)

## Project Structure

```
app/
  articles/
    [articleId]/
      page.tsx
  page.tsx (home page with links)
```

## Passing params and searchParams via Links

In the home page, create links that include both route parameters and query string parameters:

```tsx
// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>News Portal</h1>
      <Link href="/articles/breaking-news-123?language=en">
        Read in English
      </Link>
      <Link href="/articles/breaking-news-123?language=fr">
        Read in French
      </Link>
    </div>
  );
}
```

Here, `breaking-news-123` is the dynamic route parameter and `language` is the query parameter.

## Accessing params and searchParams in a Page

In Next.js 15, both `params` and `searchParams` are asynchronous. The page component receives them as promises:

```tsx
// app/articles/[articleId]/page.tsx
import Link from "next/link";

type Params = Promise<{ articleId: string }>;
type SearchParams = Promise<{ language: string }>;

export default async function NewsArticle({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { articleId } = await params;
  const { language } = await searchParams;

  return (
    <div>
      <h1>News Article: {articleId}</h1>
      <p>Reading in: {language}</p>

      <h2>Language Switcher</h2>
      <Link href={`/articles/${articleId}?language=en`}>English</Link>
      <Link href={`/articles/${articleId}?language=es`}>Spanish</Link>
      <Link href={`/articles/${articleId}?language=fr`}>French</Link>
    </div>
  );
}
```

## Language Switcher Navigation

The language switcher preserves the dynamic route segment (`articleId`) while updating the query parameter (`language`). When you click a language link:

1. The route stays at `/articles/breaking-news-123`
2. The query string updates to `?language=es`, `?language=fr`, etc.
3. The page re-renders with the new `searchParams` value

## Using searchParams for Filtering and Sorting

Beyond language switching, `searchParams` is commonly used for:

- Filtering: `/products?category=electronics`
- Sorting: `/products?sort=price&order=asc`
- Pagination: `/products?page=2&limit=20`
- Search queries: `/products?q=keyword`

```tsx
// app/products/page.tsx
type SearchParams = Promise<{
  category?: string;
  sort?: string;
  page?: string;
}>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { category, sort, page } = await searchParams;

  const currentPage = page ? parseInt(page) : 1;
  const categoryFilter = category || "all";
  const sortOrder = sort || "default";

  return (
    <div>
      <h1>Products</h1>
      <p>Category: {categoryFilter}</p>
      <p>Sort: {sortOrder}</p>
      <p>Page: {currentPage}</p>
    </div>
  );
}
```

## Key Points

- Both `params` and `searchParams` are **promises** in Next.js 15 and must be awaited
- `params` contains dynamic route parameters derived from the folder structure
- `searchParams` contains URL query string key-value pairs
- `searchParams` is always a string-keyed object; numeric values arrive as strings
- Page components should be `async` when using these props
- Links can dynamically construct URLs using template literals
