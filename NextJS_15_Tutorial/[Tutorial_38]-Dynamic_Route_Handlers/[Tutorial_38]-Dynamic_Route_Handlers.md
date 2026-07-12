# Dynamic Route Handlers

## Overview

Dynamic route handlers allow you to target specific resources by ID. They follow the same bracket-folder convention as dynamic page routes and are essential for PATCH and DELETE operations.

## Directory Structure

```
app/
  comments/
    data.ts
    route.ts          # Handles GET (all) and POST
    [id]/
      route.ts        # Handles GET (single), PATCH, DELETE
```

## Creating a Dynamic Route Handler

### Route Parameter Access

The handler function receives two parameters:
- `request`: The incoming `Request` object
- `context`: An object containing `params` -- a `Promise` resolving to route parameters

**`app/comments/[id]/route.ts`**:

```typescript
import { comments } from "../data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comment = comments.find((c) => c.id === parseInt(id));

  if (!comment) {
    return new Response("Comment not found", { status: 404 });
  }

  return Response.json(comment);
}
```

## Testing with Thunder Client

| Request          | URL                           | Response                            |
|------------------|-------------------------------|-------------------------------------|
| `GET /comments/1` | `http://localhost:3000/comments/1` | `{ "id": 1, "text": "First comment" }` |
| `GET /comments/2` | `http://localhost:3000/comments/2` | `{ "id": 2, "text": "Second comment" }` |
| `GET /comments/3` | `http://localhost:3000/comments/3` | `{ "id": 3, "text": "Third comment" }` |
| `GET /comments/99` | `http://localhost:3000/comments/99` | `404 Comment not found` |

## Complete Dynamic Route Handler with Error Handling

```typescript
import { comments } from "../data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const commentId = parseInt(id);

  if (isNaN(commentId)) {
    return new Response("Invalid ID format", { status: 400 });
  }

  const comment = comments.find((c) => c.id === commentId);

  if (!comment) {
    return new Response("Comment not found", { status: 404 });
  }

  return Response.json(comment);
}
```

## Route Parameter Comparison

| Concept               | Page Routes                     | Route Handlers                       |
|-----------------------|---------------------------------|--------------------------------------|
| Folder naming         | `[id]`                          | `[id]`                               |
| Parameter access      | `props.params`                  | `context.params` (Promise)           |
| Parameter type        | Direct object                   | `Promise<{ [key: string]: string }>` |
| Await required        | No (Next.js resolves it)        | Yes (`await params`)                 |

## Multiple Dynamic Parameters

Route handlers support multiple dynamic segments, just like page routes:

```
app/
  posts/
    [year]/
      [month]/
        route.ts
```

**`app/posts/[year]/[month]/route.ts`**:

```typescript
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ year: string; month: string }> }
) {
  const { year, month } = await params;
  return Response.json({ year, month, message: `Posts from ${year}/${month}` });
}
```

## Catch-All and Optional Catch-All Routes

Dynamic route handlers support catch-all (`[...slug]`) and optional catch-all (`[[...slug]]`) segments:

```
app/
  docs/
    [...slug]/
      route.ts
```

**`app/docs/[...slug]/route.ts`**:

```typescript
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  return Response.json({
    segments: slug,
    path: slug?.join("/"),
  });
}
```

| URL                       | `slug` value                 |
|---------------------------|------------------------------|
| `/docs`                   | (404 -- catch-all requires at least one segment) |
| `/docs/guide`             | `["guide"]`                  |
| `/docs/guide/getting-started` | `["guide", "getting-started"]` |

For an optional catch-all (`[[...slug]]`), `/docs` returns `slug: []` instead of 404.

## Type Safety with Generics

Define interfaces for strongly typed route parameters:

```typescript
interface CommentRouteParams {
  id: string;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<CommentRouteParams> }
) {
  const { id } = await params;
  // id is typed as string
  const comment = comments.find((c) => c.id === parseInt(id));
  return Response.json(comment);
}
```

## Key Points

- Dynamic route handlers use the same `[param]` folder convention as page routes
- Route parameters are accessed via the `params` property in the second argument, which is a `Promise` that must be awaited
- Prefix unused parameters with an underscore (e.g., `_request`) to indicate they are intentionally unused
- Always validate that the parameter exists and is in the expected format
- Return a `404` response when the requested resource is not found
- Catch-all `[...slug]` and optional catch-all `[[...slug]]` patterns work with route handlers
- Use TypeScript interfaces for type-safe parameter access
