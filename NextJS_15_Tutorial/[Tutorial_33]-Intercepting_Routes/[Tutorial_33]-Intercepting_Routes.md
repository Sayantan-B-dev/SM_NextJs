# Intercepting Routes

## Overview

Intercepting routes allow you to load a route from another part of your application within the current layout context. This is useful for displaying modal overlays, login dialogs, or detail views while preserving the underlying page state.

### Use Cases

- Showing a login modal while updating the URL to `/login`; refreshing loads the full login page
- Displaying a photo detail overlay within a gallery; direct access to the URL shows the dedicated photo page
- Any scenario where you want alternative UI during navigation but standard UI on direct access

## Conventions

Intercepting routes use parentheses with dots to indicate the target route's position relative to the source.

| Prefix   | Meaning                                 | Example                          |
|----------|-----------------------------------------|----------------------------------|
| `(.)`    | Match segment at the same level         | `(.)folder-name`                 |
| `(..)`   | Match segment one level up              | `(..)folder-name`                |
| `(..)(..)` | Match segment two levels up           | `(..)(..)folder-name`            |
| `(...)`  | Match segment from the app root         | `(...)folder-name`               |

## Basic Setup

### File Structure

```
app/
  F1/
    page.tsx
    F2/
      page.tsx
  F3/
    page.tsx
  F4/
    page.tsx
  F5/
    page.tsx
```

**`F1/page.tsx`**:

```tsx
import Link from "next/link";

export default function F1() {
  return (
    <div>
      <h1>F1 Page</h1>
      <div>
        <Link href="/F1/F2">F2</Link>
      </div>
      <div>
        <Link href="/F3">F3</Link>
      </div>
    </div>
  );
}
```

**`F1/F2/page.tsx`**:

```tsx
import Link from "next/link";

export default function F2() {
  return (
    <div>
      <h1>F2 Page</h1>
      <div>
        <Link href="/F4">F4</Link>
      </div>
    </div>
  );
}
```

## Convention 1: Same-Level Interception `(.)`

To intercept the F2 route when navigating from F1 (both share the same parent):

```
F1/
  page.tsx
  (.)F2/
    page.tsx
```

**`F1/(.)F2/page.tsx`**:

```tsx
export default function InterceptedF2() {
  return (
    <div>
      <h1>(.) Intercepted F2 Page</h1>
    </div>
  );
}
```

When clicking the F2 link from `/F1`, the URL shows `/F1/F2` but the intercepted content renders. Refreshing the page displays the original F2 page.

## Convention 2: One Level Up `(..)`

To intercept the F3 route when navigating from F1 (F3 is one level above F1):

```
F1/
  page.tsx
  (..)F3/
    page.tsx
  F2/
    page.tsx
```

**`F1/(..)F3/page.tsx`**:

```tsx
export default function InterceptedF3() {
  return (
    <div>
      <h1>(..) Intercepted F3 Page</h1>
    </div>
  );
}
```

## Convention 3: Two Levels Up `(..)(..)`

To intercept the F4 route when navigating from `F1/F2` (F4 is two levels above):

```
F1/
  F2/
    page.tsx
    (..)(..)F4/
      page.tsx
```

**`F1/F2/(..)(..)F4/page.tsx`**:

```tsx
export default function InterceptedF4() {
  return (
    <div>
      <h1>(..)(..) Intercepted F4 Page</h1>
    </div>
  );
}
```

## Convention 4: Root Level `(...)`

To intercept the F5 route from a deeply nested folder (match from app root):

```
F1/
  F2/
    page.tsx
    inner-F2/
      page.tsx
      (...)F5/
        page.tsx
F5/
  page.tsx
```

**`F1/F2/inner-F2/(...)F5/page.tsx`**:

```tsx
export default function InterceptedF5() {
  return (
    <div>
      <h1>(...) Intercepted F5 Page</h1>
    </div>
  );
}
```

## Behavior Summary

| Action                             | Result                              |
|------------------------------------|-------------------------------------|
| Client-side navigation via Link    | Intercepted route content is shown  |
| Page refresh / direct URL access   | Original route content is shown     |
| URL updates                        | Same as the target route            |

## Key Points

- Intercepting routes only apply to client-side navigation (Link component, `useRouter`)
- Direct access or page reloads bypass interception and render the standard route
- The interception prefix follows relative path conventions: `(.)` for current, `(..)` for parent, `(...)` for root
- Intercepted pages can have completely different UI from the target page
