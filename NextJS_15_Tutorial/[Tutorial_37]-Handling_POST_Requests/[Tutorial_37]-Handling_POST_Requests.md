# Handling POST Requests

## Overview

The POST method creates new resources. This section extends the comments route handler to accept and store new comments from request bodies.

## Adding a POST Handler

**`app/comments/route.ts`**:

```typescript
import { comments } from "./data";

export async function GET() {
  return Response.json(comments);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newComment = {
    id: comments.length + 1,
    text: body.text,
  };
  comments.push(newComment);

  return new Response(JSON.stringify(newComment), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
```

### Request Flow

1. The `request` parameter contains the incoming HTTP request
2. `await request.json()` extracts the JSON body
3. A new comment object is created with an auto-generated ID
4. The comment is added to the in-memory array
5. A `201 Created` response is returned with the new comment

## Testing with Thunder Client

1. Create a new request:
   - Method: `POST`
   - URL: `http://localhost:3000/comments`
   - Body (JSON): `{ "text": "New comment" }`
2. Click Send

**Expected Response** (Status 201 Created):

```json
{
  "id": 4,
  "text": "New comment"
}
```

## Verification

Switch to a GET request to `/comments` to see the updated array:

```json
[
  { "id": 1, "text": "First comment" },
  { "id": 2, "text": "Second comment" },
  { "id": 3, "text": "Third comment" },
  { "id": 4, "text": "New comment" }
]
```

## Error Handling

Add validation for missing or invalid request bodies:

```typescript
export async function POST(request: Request) {
  let body: { text?: string };

  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (!body.text || typeof body.text !== "string") {
    return new Response("Text field is required", { status: 400 });
  }

  const newComment = {
    id: comments.length + 1,
    text: body.text,
  };
  comments.push(newComment);

  return new Response(JSON.stringify(newComment), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
```

## HTTP Status Codes for POST

| Status Code | Meaning            | When to Use                        |
|-------------|--------------------|-------------------------------------|
| 201         | Created            | Resource successfully created       |
| 400         | Bad Request        | Missing or invalid request body     |
| 405         | Method Not Allowed | No POST handler defined for route   |

## Key Points

- Export an async function named `POST` from `route.ts`
- Use `await request.json()` to parse the incoming JSON body
- Return status `201` for successful resource creation
- Always validate input data before processing
- In-memory changes are temporary; data resets when the server restarts
