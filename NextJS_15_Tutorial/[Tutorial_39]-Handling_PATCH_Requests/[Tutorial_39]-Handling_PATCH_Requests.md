# Handling PATCH Requests

## Overview

The PATCH method partially updates an existing resource. Unlike POST (which creates) and PUT (which replaces), PATCH modifies only the provided fields.

## Adding a PATCH Handler

**`app/comments/[id]/route.ts`**:

```typescript
import { comments } from "../data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comment = comments.find((c) => c.id === parseInt(id));
  return Response.json(comment);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { text } = body;

  const index = comments.findIndex((c) => c.id === parseInt(id));

  if (index === -1) {
    return new Response("Comment not found", { status: 404 });
  }

  if (!text || typeof text !== "string") {
    return new Response("Text field is required", { status: 400 });
  }

  comments[index].text = text;

  return Response.json(comments[index]);
}
```

## Testing with Thunder Client

1. Create a new request:
   - Method: `PATCH`
   - URL: `http://localhost:3000/comments/3`
   - Body (JSON):
     ```json
     { "text": "Updated comment" }
     ```
2. Click Send

**Expected Response** (Status 200 OK):

```json
{
  "id": 3,
  "text": "Updated comment"
}
```

## Verification

Make a GET request to `/comments` to confirm the update:

```json
[
  { "id": 1, "text": "First comment" },
  { "id": 2, "text": "Second comment" },
  { "id": 3, "text": "Updated comment" }
]
```

## Complete Route Handler with All Methods

**`app/comments/[id]/route.ts`**:

```typescript
import { comments } from "../data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const commentId = parseInt(id);

  if (isNaN(commentId)) {
    return new Response("Invalid ID", { status: 400 });
  }

  const comment = comments.find((c) => c.id === commentId);

  if (!comment) {
    return new Response("Comment not found", { status: 404 });
  }

  return Response.json(comment);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const commentId = parseInt(id);

  if (isNaN(commentId)) {
    return new Response("Invalid ID", { status: 400 });
  }

  const body = await request.json();

  if (!body.text || typeof body.text !== "string") {
    return new Response("Text field is required", { status: 400 });
  }

  const index = comments.findIndex((c) => c.id === commentId);

  if (index === -1) {
    return new Response("Comment not found", { status: 404 });
  }

  comments[index].text = body.text;

  return Response.json(comments[index]);
}
```

## HTTP Status Codes for PATCH

| Status Code | Meaning            | When to Use                        |
|-------------|--------------------|-------------------------------------|
| 200         | OK                 | Resource successfully updated       |
| 400         | Bad Request        | Missing or invalid fields in body   |
| 404         | Not Found          | Resource ID does not exist          |
| 405         | Method Not Allowed | No PATCH handler defined            |

## Key Points

- Export an async function named `PATCH` for partial updates
- Use `findIndex` to locate the resource by ID for efficient updates
- Validate both the route parameter and the request body
- In-memory data changes do not persist across server restarts
- PATCH updates only the specified fields; omitted fields remain unchanged
