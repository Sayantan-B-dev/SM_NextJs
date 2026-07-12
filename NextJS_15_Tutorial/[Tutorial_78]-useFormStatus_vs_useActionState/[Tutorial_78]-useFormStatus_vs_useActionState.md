# useFormStatus vs useActionState

## Overview

Both `useFormStatus` and `useActionState` provide a boolean indicating whether an action is in progress. Understanding their differences helps choose the right hook for each scenario.

## Comparison Table

| Feature | `useFormStatus` | `useActionState` |
|---------|---------------|------------------|
| Hook source | `react-dom` | `react` |
| Pending property | `pending` | `isPending` |
| Scope | Only parent `<form>` submissions | Any action, form or non-form |
| Component type required | Client component | Client component |
| Access to form data | Yes (`data`, `method`, `action`) | No (only state and pending) |
| Reusability | High (extracted into button components) | Medium (tied to specific action) |

## When to Use `useFormStatus`

Use `useFormStatus` when building **reusable components** that live inside forms.

### Ideal Use Cases

- Submit buttons with loading indicators
- Loading spinners positioned inside forms
- Disabling all form controls during submission
- Components used across multiple forms

### Example: Reusable Submit Button

```typescript
// src/components/submit.tsx
"use client";

import { useFormStatus } from "react-dom";

export const Submit = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`px-4 py-2 rounded text-white ${
        pending ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
};
```

This component can be dropped into any form and will automatically detect its pending state.

## When to Use `useActionState`

Use `useActionState` when you need to:
- Track pending state for **non-form server actions**
- Access the **returned state** from the action (for validation, success messages, etc.)
- Manage action state without a form element

### Ideal Use Cases

- Form validation with error state display
- Server actions triggered outside of forms (buttons with `onClick`, etc.)
- Actions needing state management beyond just pending

### Example

```typescript
"use client";

import { useActionState } from "react";
import { createProduct } from "@/actions/products";

const initialState = { errors: {} };

export default function AddProductPage() {
  const [state, formAction, isPending] = useActionState(
    createProduct,
    initialState
  );

  return (
    <form action={formAction}>
      {/* ...form fields with error display... */}
      <button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
```

## Can You Use Either?

In a form submission scenario, yes -- both `pending` and `isPending` achieve the same visual result. The choice depends on architecture:

| Scenario | Recommended Hook |
|----------|-----------------|
| Reusable button component used in many forms | `useFormStatus` |
| Single form with validation state management | `useActionState` |
| Non-form server action (e.g., button with onClick) | `useActionState` |
| Access to form submission data (`data`, `method`) | `useFormStatus` |
| Access to action return value (errors, success) | `useActionState` |

## Combined Usage

Both hooks can coexist in the same form:

```typescript
// page.tsx (server component)
// - uses useActionState for form state and validation

// submit.tsx (client component)
// - uses useFormStatus for button pending state
```

The `useActionState` handles the overall form state (errors, validation), while the extracted `Submit` component uses `useFormStatus` for the button's pending state.

## Summary

| Hook | Best For |
|------|----------|
| `useFormStatus` | Reusable form sub-components (buttons, spinners) |
| `useActionState` | Form state management with validation, non-form actions |

Choose `useFormStatus` for reusable form controls and `useActionState` for managing action state with return values. For simple form submission with a submit button, either works.
