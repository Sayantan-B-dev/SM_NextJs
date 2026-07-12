## Optimistic Updates

Optimistic updates allow the UI to reflect a change immediately while the server action is still in progress, making applications feel more responsive.

### The `useOptimistic` Hook

The `useOptimistic` hook is a React hook that provides a way to optimistically update the UI while an asynchronous action is underway.

```typescript
import { useOptimistic } from "react";
```

### Parameters

The hook accepts two arguments:

| Parameter | Description |
|-----------|-------------|
| `initialState` | The initial data state (e.g., list of products) |
| `updateFn` | A function that takes `(currentState, action)` and returns the new optimistic state |

### Return Values

The hook returns a tuple:

| Value | Description |
|-------|-------------|
| `optimisticState` | The state to render in the UI |
| `optimisticAction` | A function to trigger the optimistic update |

### Example: Optimistic Delete

```tsx
// app/products-db/page.tsx
import { useOptimistic } from "react";
import { deleteProduct } from "@/lib/actions";

export default function ProductsPage({ products }: { products: Product[] }) {
  const [optimisticProducts, setOptimisticProducts] = useOptimistic(
    products,
    (currentProducts, productId: string) => {
      return currentProducts.filter((product) => product.id !== productId);
    }
  );

  async function handleDelete(productId: string) {
    setOptimisticProducts(productId);
    await deleteProduct(productId);
  }

  return (
    <ul>
      {optimisticProducts.map((product) => (
        <li key={product.id}>
          {product.name}
          <form action={() => handleDelete(product.id)}>
            <button type="submit">Delete</button>
          </form>
        </li>
      ))}
    </ul>
  );
}
```

### How It Works

1. The user clicks the delete button on a product.
2. `setOptimisticProducts(productId)` is called immediately, which triggers the `updateFn` to remove the product from the list.
3. The UI re-renders instantly showing the product as deleted.
4. The actual server action `deleteProduct(productId)` runs in the background.
5. If the server action succeeds, the state remains correct. If it fails, you can revert by re-fetching the data.

### Error Handling with Reversion

```tsx
async function handleDelete(productId: string) {
  setOptimisticProducts(productId);
  try {
    await deleteProduct(productId);
  } catch {
    // Re-fetch products to revert optimistic update on failure
    revalidatePath("/products-db");
  }
}
```

### Best Practices

- Call `setOptimisticProducts` before the async operation for instant feedback.
- Use the server response or error boundaries to revert on failure.
- Pair with `revalidatePath` or `revalidateTag` to keep server state in sync.
- Keep the `updateFn` pure and synchronous.
