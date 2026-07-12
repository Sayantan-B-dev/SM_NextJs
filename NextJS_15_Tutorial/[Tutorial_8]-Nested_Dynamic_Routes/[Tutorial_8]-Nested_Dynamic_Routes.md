# Nested Dynamic Routes

Real-world applications often need multiple dynamic segments in a single URL. Nested dynamic routes handle this pattern.

## Scenario 5: Product Reviews

We need:
- `/products/1` -- Product details
- `/products/1/reviews/1` -- Review 1 for product 1
- `/products/100/reviews/5` -- Review 5 for product 100

## Folder Structure

```
src/
  app/
    products/
      [productId]/
        page.tsx
        reviews/
          [reviewId]/
            page.tsx
```

## Implementation

### Product Details Page

```typescript
// src/app/products/[productId]/page.tsx
export default async function ProductDetails({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  return <h1>Details about product {productId}</h1>;
}
```

### Nested Dynamic Review Page

```typescript
// src/app/products/[productId]/reviews/[reviewId]/page.tsx
export default async function ProductReview({
  params,
}: {
  params: Promise<{ productId: string; reviewId: string }>;
}) {
  const { productId, reviewId } = await params;

  return (
    <h1>
      Review {reviewId} for product {productId}
    </h1>
  );
}
```

## Route to URL Mapping

| File Path | URL |
|-----------|-----|
| `app/products/[productId]/page.tsx` | `/products/:productId` |
| `app/products/[productId]/reviews/[reviewId]/page.tsx` | `/products/:productId/reviews/:reviewId` |

## How It Works

The `params` prop contains all dynamic segments from the URL path:

```typescript
// For URL: /products/42/reviews/7
params: Promise<{ productId: "42"; reviewId: "7" }>
```

Each dynamic segment name corresponds to its folder name in square brackets.

## Visual Structure

```
app/
  page.tsx                                    ->  /
  products/
    [productId]/
      page.tsx                                ->  /products/:productId
      reviews/
        [reviewId]/
          page.tsx                            ->  /products/:productId/reviews/:reviewId
```

## Exercise

Create a review listing page for each product by adding a `page.tsx` file inside the `reviews` folder (sibling to `[reviewId]`) that lists a couple of reviews for the given product.

## Key Takeaway

You can create nested dynamic routes simply by combining dynamic segments (`[paramName]`) with nested folder structures. Each dynamic segment is accessible via the `params` prop and can be used to fetch corresponding data.
