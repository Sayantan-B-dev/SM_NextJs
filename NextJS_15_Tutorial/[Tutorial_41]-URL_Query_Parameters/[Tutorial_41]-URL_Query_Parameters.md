# URL Query Parameters

## Introduction

Query parameters allow clients to filter, sort, or customize API responses by appending key-value pairs to the URL. In Next.js route handlers, the `NextRequest` object provides dedicated methods for reading and working with query parameters.

## Prerequisites

- Basic route handler setup (GET handler)
- Understanding of `app/api` directory structure

## Accessing Query Parameters

Next.js extends the standard `Request` API with `NextRequest`, which includes a `nextUrl` property containing parsed URL details.

### Step 1: Import NextRequest

```typescript
import { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  // Handler logic
}
```

### Step 2: Read Query Parameters

Use `request.nextUrl.searchParams` (a `URLSearchParams` instance) to access query values.

```typescript
import { NextRequest } from "next/server";

const comments = [
  { id: 1, text: "first comment" },
  { id: 2, text: "second comment" },
  { id: 3, text: "third comment" },
  { id: 4, text: "first response" },
];

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (query) {
    const filteredComments = comments.filter((comment) =>
      comment.text.includes(query)
    );
    return Response.json(filteredComments);
  }

  return Response.json(comments);
}
```

### Step 3: Test in Browser

| URL | Response |
|---|---|
| `/api/comments` | All 4 comments |
| `/api/comments?query=first` | Comments containing "first" |
| `/api/comments?query=ir` | Comments containing "ir" |

## Using searchParams.get()

The `get()` method returns the value of the first matching query parameter, or `null` if none exists.

```bash
GET /api/comments?query=first
# request.nextUrl.searchParams.get("query") => "first"

GET /api/comments
# request.nextUrl.searchParams.get("query") => null
```

## Additional searchParams Methods

`URLSearchParams` provides several useful methods:

| Method | Description |
|---|---|
| `get(key)` | Returns the value of the first matching parameter |
| `getAll(key)` | Returns all values for a given parameter |
| `has(key)` | Returns `true` if the parameter exists |
| `keys()` | Returns an iterator of all parameter names |
| `entries()` | Returns an iterator of all key-value pairs |

### Example with Multiple Parameters

```typescript
export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = params.get("query");
  const limit = params.get("limit");
  const sort = params.get("sort");

  let result = [...comments];

  if (query) {
    result = result.filter((c) => c.text.includes(query));
  }

  if (limit) {
    result = result.slice(0, Number(limit));
  }

  if (sort === "desc") {
    result.reverse();
  }

  return Response.json(result);
}
```

## Full Request URL Breakdown

```
http://localhost:3000/api/comments?query=first&sort=desc
├──────────────────┬──────────────────────┬───────────────────┬──────────────┐
     origin               pathname              search            hash
```

- `nextUrl.origin` -- `http://localhost:3000`
- `nextUrl.pathname` -- `/api/comments`
- `nextUrl.searchParams` -- `{ query: "first", sort: "desc" }`

## Key Points

- Import `NextRequest` from `next/server` for typed query parameter access
- Use `request.nextUrl.searchParams.get("key")` to read individual parameters
- `searchParams` is a standard `URLSearchParams` object
- Query parameters are always strings -- parse with `Number()` for numeric values
- Returns `null` for missing parameters, not `undefined`

## Related Topics

- Headers in Route Handlers
- Cookies in Route Handlers
- Redirects in Route Handlers
