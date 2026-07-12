# Catch-all Segments

Catch-all segments allow a single route file to handle multiple URL path segments. This is useful for documentation sites, category hierarchies, or any nested content structure.

## Scenario 6: Documentation Site

We need URLs like:
- `/docs/feature1/concept1`
- `/docs/feature1/concept2`
- `/docs/feature2/concept1`
- `/docs/feature1/concept1/example1`

Without catch-all segments, every new path depth requires another folder level.

## Catch-all Segment Syntax

Use three dots inside square brackets to create a catch-all segment:

```
src/
  app/
    docs/
      [...slug]/
        page.tsx
```

The folder name `[...slug]` captures **all** remaining URL segments into an array.

## Basic Implementation

```typescript
// src/app/docs/[...slug]/page.tsx
export default function Docs({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  return <h1>Docs Homepage</h1>;
}
```

This single file matches any URL starting with `/docs/`, regardless of depth.

## Accessing Captured Segments

The `slug` parameter is an array of strings representing each URL segment:

```typescript
export default async function Docs({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const slug = await params;

  if (slug?.length === 2) {
    return (
      <h1>
        Viewing docs for feature {slug[0]} and concept {slug[1]}
      </h1>
    );
  } else if (slug?.length === 1) {
    return <h1>Viewing docs for feature {slug[0]}</h1>;
  }

  return <h1>Docs Homepage</h1>;
}
```

## URL Matching Examples

| URL | `slug` Array | Match |
|-----|-------------|-------|
| `/docs` | N/A | 404 (without optional catch-all) |
| `/docs/routing` | `["routing"]` | Feature page |
| `/docs/routing/catch-all` | `["routing", "catch-all"]` | Concept page |
| `/docs/routing/catch-all/examples` | `["routing", "catch-all", "examples"]` | Catch-all capture |

## Optional Catch-all Segments

To also match `/docs` (without any segments), wrap the folder name in an extra pair of square brackets:

```
src/
  app/
    docs/
      [[...slug]]/
        page.tsx
```

With the optional catch-all, `/docs` now works and the `slug` parameter will be `undefined`.

## When to Use Each Pattern

| Pattern | Folder Name | Matches `/docs` | Use Case |
|---------|-------------|-----------------|----------|
| Simple page | No slug folder | Yes | Static docs page |
| Catch-all | `[...slug]` | No | Dynamic content, different UI per path |
| Optional catch-all | `[[...slug]]` | Yes | Dynamic content, same base layout |

## Visual Structure

```
app/
  page.tsx                      ->  /
  docs/
    [[...slug]]/
      page.tsx                  ->  /docs, /docs/*, /docs/*/*
```

## Key Takeaway

Catch-all segments capture multiple URL path segments into a single array parameter, reducing the need for deeply nested folder structures. Use the optional variant when you also need the base path to be valid.
