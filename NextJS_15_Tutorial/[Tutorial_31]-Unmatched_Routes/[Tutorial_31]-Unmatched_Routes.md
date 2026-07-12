# Unmatched Routes

## Overview

When using parallel routes in Next.js, navigating within a slot can cause other slots to become "unmatched" if their content does not correspond to the current URL. Next.js handles these unmatched slots differently for client-side navigation versus page reloads.

## Subnavigation Within Slots

A parallel route slot can contain regular route folders for subnavigation, while other slots remain unaffected.

### Example: Archived Notifications

**Directory structure:**
```
app/
  complex-dashboard/
    @notifications/
      page.tsx
      archived/
        page.tsx
    @children/
      page.tsx
    @users/
      page.tsx
    @revenue/
      page.tsx
    layout.tsx
    page.tsx
```

**`@notifications/page.tsx`** -- Default notifications view with navigation:

```tsx
import Link from "next/link";

export default function Notifications() {
  return (
    <div>
      <h2>Notifications</h2>
      <div>
        <Link href="/complex-dashboard/archived">Archived</Link>
      </div>
      <div>
        <p>Default notifications content</p>
      </div>
    </div>
  );
}
```

**`@notifications/archived/page.tsx`** -- Archived notifications view (regular route, not a slot):

```tsx
import Link from "next/link";

export default function ArchivedNotifications() {
  return (
    <div>
      <h2>Archived Notifications</h2>
      <div>
        <Link href="/complex-dashboard">Default</Link>
      </div>
      <div>
        <p>Archived notifications content</p>
      </div>
    </div>
  );
}
```

When clicking the "Archived" link, the URL changes to `/complex-dashboard/archived` and the archived content is displayed. Only the `@notifications` slot has content for this route -- the other slots (`children`, `users`, `revenue`) become unmatched.

## How Unmatched Routes Behave

| Navigation Type | Behavior for Unmatched Slots |
|-----------------|------------------------------|
| Client-side navigation (clicking links) | Previous content remains visible |
| Page reload / direct URL access | 404 error unless `default.tsx` is provided |

### Client-Side Navigation

When navigating via the Link component, unmatched slots retain their previously rendered content. The `children`, `users`, and `revenue` slots remain unchanged when moving between `/complex-dashboard` and `/complex-dashboard/archived`.

### Page Reload

Reloading a URL where slots are unmatched triggers a 404 error unless each unmatched slot provides a `default.tsx` fallback file.

## The `default.tsx` Fallback

The `default.tsx` file defines what to render when a slot cannot determine its active state from the current URL.

### Adding Fallbacks

Create a `default.tsx` file inside each slot folder that may become unmatched.

**`complex-dashboard/@children/default.tsx`**:

```tsx
export default function Default() {
  return (
    <div>
      <h2>Complex Dashboard</h2>
    </div>
  );
}
```

**`complex-dashboard/@users/default.tsx`**:

```tsx
export default function Default() {
  return (
    <div>
      <h2>User Analytics Default Content</h2>
    </div>
  );
}
```

**`complex-dashboard/@revenue/default.tsx`**:

```tsx
export default function Default() {
  return (
    <div>
      <h2>Revenue Metrics</h2>
    </div>
  );
}
```

Once `default.tsx` is present in each slot, reloading `/complex-dashboard/archived` works correctly:
- The `@notifications` slot renders `archived/page.tsx`
- The `@children`, `@users`, and `@revenue` slots render their respective `default.tsx` content

## Key Points

- Unmatched slots occur when navigating within one parallel route slot while others have no matching route segment
- Client-side navigation preserves existing slot content
- Page reloads require `default.tsx` in every slot to avoid 404 errors
- `default.tsx` content is independent of `page.tsx` -- you can show different UI for fallback states
- Restart the development server if fallback files do not take effect
