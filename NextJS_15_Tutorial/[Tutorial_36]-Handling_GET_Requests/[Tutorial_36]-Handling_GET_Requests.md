# Handling GET Requests

## Overview

The GET method retrieves data from a route handler. This section demonstrates creating an in-memory data store and a GET endpoint to return it.

## Setup: In-Memory Data

Create the data file and route handler inside a `comments` folder.

### Directory Structure

```
app/
  comments/
    data.ts
    route.ts
```

### Data File

**`app/comments/data.ts`**:

```typescript
export interface Comment {
  id: number;
  text: string;
}

export const comments: Comment[] = [
  { id: 1, text: "First comment" },
  { id: 2, text: "Second comment" },
  { id: 3, text: "Third comment" },
];
```

### GET Route Handler

**`app/comments/route.ts`**:

```typescript
import { comments } from "./data";

export async function GET() {
  return Response.json(comments);
}
```

## Testing with Thunder Client

1. Install the Thunder Client extension in VS Code
2. Create a new request:
   - Method: `GET`
   - URL: `http://localhost:3000/comments`
3. Click Send

**Expected Response** (Status 200 OK):

```json
[
  { "id": 1, "text": "First comment" },
  { "id": 2, "text": "Second comment" },
  { "id": 3, "text": "Third comment" }
]
```

## Alternative: Custom Response Object

You can also construct the response manually:

```typescript
import { comments } from "./data";

export async function GET() {
  return new Response(JSON.stringify(comments), {
    headers: { "Content-Type": "application/json" },
  });
}
```

## Integration in a Real Application

In a production app, the UI would fetch this data:

```tsx
// app/comments-page/page.tsx
import { comments } from "@/app/comments/data";

export default async function CommentsPage() {
  const res = await fetch("http://localhost:3000/comments");
  const comments = await res.json();

  return (
    <ul>
      {comments.map((comment: { id: number; text: string }) => (
        <li key={comment.id}>{comment.text}</li>
      ))}
    </ul>
  );
}
```

## Multiple GET Endpoints

Route handlers support multiple GET endpoints through folder nesting:

```
app/
  api/
    comments/
      route.ts       # GET /api/comments
      [id]/
        route.ts     # GET /api/comments/:id
```

**`app/api/comments/route.ts`**:

```typescript
import { comments } from "./data";

export async function GET() {
  return Response.json(comments);
}
```

**`app/api/comments/[id]/route.ts`**:

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

## Caching Behavior

By default, GET route handlers are cached in Next.js. To opt out of caching:

```typescript
export async function GET() {
  const data = await fetch("https://api.example.com/data", {
    next: { revalidate: 0 },
  });
  return Response.json(data);
}
```

Or use the `export const dynamic = 'force-dynamic'` directive:

```typescript
export const dynamic = "force-dynamic";

export async function GET() {
  // This response will not be cached
  return Response.json(comments);
}
```

## Key Points

- Export an async function named `GET` from `route.ts`
- Use `Response.json()` to return structured JSON data
- In-memory data persists only during the server runtime; refreshing the server resets the data
- Test route handlers with Thunder Client, Postman, or similar API clients
- GET route handlers are cached by default in production; use `force-dynamic` or `revalidate` to control caching
