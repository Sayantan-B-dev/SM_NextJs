# Handling DELETE Requests

## Overview

The DELETE method removes a specified resource. In this implementation, the deleted resource is returned in the response body so the client can confirm what was removed.

## Adding a DELETE Handler

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
  const index = comments.findIndex((c) => c.id === parseInt(id));
  comments[index].text = body.text;
  return Response.json(comments[index]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const commentId = parseInt(id);

  if (isNaN(commentId)) {
    return new Response("Invalid ID", { status: 400 });
  }

  const index = comments.findIndex((c) => c.id === commentId);

  if (index === -1) {
    return new Response("Comment not found", { status: 404 });
  }

  const deletedComment = comments[index];
  comments.splice(index, 1);

  return Response.json(deletedComment);
}
```

## Testing with Thunder Client

1. Create a new request:
   - Method: `DELETE`
   - URL: `http://localhost:3000/comments/3`
   - Body: not required for DELETE requests
2. Click Send

**Expected Response** (Status 200 OK):

```json
{
  "id": 3,
  "text": "Third comment"
}
```

## Verification

Make a GET request to `/comments` to confirm the deletion:

```json
[
  { "id": 1, "text": "First comment" },
  { "id": 2, "text": "Second comment" }
]
```

## Complete CRUD Route Handler

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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const commentId = parseInt(id);

  if (isNaN(commentId)) {
    return new Response("Invalid ID", { status: 400 });
  }

  const index = comments.findIndex((c) => c.id === commentId);

  if (index === -1) {
    return new Response("Comment not found", { status: 404 });
  }

  const deletedComment = comments[index];
  comments.splice(index, 1);

  return Response.json(deletedComment);
}
```

## HTTP Methods Summary

| Method | URL              | Status | Response Body              |
|--------|------------------|--------|----------------------------|
| GET    | `/comments`      | 200    | Array of all comments      |
| GET    | `/comments/:id`  | 200    | Single comment object      |
| POST   | `/comments`      | 201    | Newly created comment      |
| PATCH  | `/comments/:id`  | 200    | Updated comment object     |
| DELETE | `/comments/:id`  | 200    | Deleted comment object     |

## Error Responses

| Status Code | Meaning            | Scenario                           |
|-------------|--------------------|------------------------------------|
| 200         | OK                 | Resource deleted successfully      |
| 400         | Bad Request        | Invalid ID format                  |
| 404         | Not Found          | Resource ID does not exist         |
| 405         | Method Not Allowed | No handler for the HTTP method     |

## Key Points

- Export an async function named `DELETE` for resource removal
- Use `splice()` to remove the resource from the in-memory array
- Return the deleted resource so the client can confirm the operation
- No request body is needed for DELETE requests
- In-memory changes are temporary; data resets when the server restarts
