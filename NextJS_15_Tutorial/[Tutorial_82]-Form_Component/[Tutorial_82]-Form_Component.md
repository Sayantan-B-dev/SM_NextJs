## Form Component

Next.js 15 introduced a built-in `Form` component built on top of the HTML `<form>` element with enhanced features for modern web applications.

### Features

| Feature | Description |
|---------|-------------|
| Automatic Prefetching | Prefetches loading UI and page data on hover |
| Client-side Navigation | Handles client-side navigation on submission |
| Progressive Enhancement | Works with or without JavaScript |

### Search Example

Create a loading state for the target page:

```tsx
// app/products-db/loading.tsx
export default function Loading() {
  return <div>Loading products...</div>;
}
```

Create a search component:

```tsx
// components/search.tsx
import Form from "next/form";

export const Search = () => {
  return (
    <Form action="/products-db">
      <input
        name="query"
        placeholder="Search products"
        className="border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded"
      >
        Submit
      </button>
    </Form>
  );
};
```

Use the search component in the homepage:

```tsx
// app/page.tsx
import { Search } from "@/components/search";

export default function HomePage() {
  return (
    <main>
      <h1>Welcome to Next.js 15</h1>
      <Search />
    </main>
  );
}
```

Handle the search query on the products page:

```tsx
// app/products-db/page.tsx
import { getProducts } from "@/lib/data";

interface Props {
  searchParams: Promise<{ query?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { query } = await searchParams;
  const products = await getProducts(query);

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

### How `next/form` Works

- When a user focuses or hovers over a `<Form>` element, Next.js prefetches the loading UI for the target route.
- On submission, the form performs a client-side navigation instead of a full page reload.
- Data is passed as URL query parameters to the target page's `searchParams`.

### Benefits Over HTML Form

- No full-page refresh — faster navigation.
- Automatic prefetching eliminates waiting for the target page.
- Works seamlessly with Next.js App Router patterns.
