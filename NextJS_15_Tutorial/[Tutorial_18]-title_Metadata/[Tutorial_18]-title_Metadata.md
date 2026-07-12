# Title Metadata

## Overview

The `title` field in Next.js metadata defines the document title displayed in the browser tab. The title can be set as either a **string** or an **object**, each offering different levels of control.

## String Title (Simple)

The simplest approach sets the title as a plain string:

```tsx
// app/about/page.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Code Evolution",
}

export default function About() {
  return <h1>About</h1>
}
```

This renders exactly "About Code Evolution" in the browser's title tag.

## Object Title (Advanced)

When you need more control, define the title as an object with three optional properties: `default`, `template`, and `absolute`.

### TypeScript Setup

```tsx
// app/layout.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Next.js Tutorial - Code Evolution",
    template: "%s | Code Evolution",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### title.default

Serves as a fallback for child routes that do not specify their own title.

```tsx
// app/blog/page.tsx
// No metadata defined -- uses default from root layout
export default function Blog() {
  return <h1>Blog</h1>
}
```

Title rendered: `Next.js Tutorial - Code Evolution`

### title.template

Defines a pattern for child route titles. The `%s` placeholder is replaced by the child's title.

```tsx
// app/blog/page.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
}

export default function Blog() {
  return <h1>Blog</h1>
}
```

With the template `"%s | Code Evolution"` in the root layout, the rendered title is: `Blog | Code Evolution`

The child page's title (`"Blog"`) replaces `%s` in the template.

### title.absolute

Bypasses the template entirely and sets the exact title.

```tsx
// app/blog/page.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    absolute: "Blog",
  },
}

export default function Blog() {
  return <h1>Blog</h1>
}
```

Even with a template like `"%s | Code Evolution"` in the root layout, the rendered title is exactly: `Blog`

The template is ignored when `absolute` is specified.

## Title Options Comparison

| Option | Type | Description | Template Applied? |
|--------|------|-------------|-------------------|
| String | `string` | Simple title string | Yes |
| `default` | `string` | Fallback for child routes without titles | Yes |
| `template` | `string` | Pattern with `%s` for child route titles | Applied to children |
| `absolute` | `string` | Exact title that ignores parent templates | No |

## Practical Example

```tsx
// app/layout.tsx -- Root Layout
export const metadata: Metadata = {
  title: {
    default: "My Website",
    template: "%s | My Website",
  },
}

// app/about/page.tsx -- inherits default (no metadata defined)
// Title: "My Website"

// app/blog/page.tsx
export const metadata: Metadata = {
  title: "Blog",
}
// Title: "Blog | My Website"

// app/contact/page.tsx
export const metadata: Metadata = {
  title: {
    absolute: "Contact Us",
  },
}
// Title: "Contact Us" (ignores template)
```

## Use Cases

| Scenario | Approach |
|----------|----------|
| Simple static page | String title |
| Multi-page app with consistent suffix | `template` + string titles on children |
| Pages with title overrides | `absolute` for specific pages |
| Section with no specific title | `default` fallback |

The object-based title API gives you fine-grained control over how titles are composed across your application's route hierarchy.
