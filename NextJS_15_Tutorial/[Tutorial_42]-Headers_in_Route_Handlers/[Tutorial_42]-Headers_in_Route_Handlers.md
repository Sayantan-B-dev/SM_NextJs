# Headers in Route Handlers

## Introduction

HTTP headers carry metadata about a request or response. In Next.js route handlers, you can both read incoming request headers and set outgoing response headers. Understanding header management is essential for authentication, content negotiation, caching, and security.

## Types of HTTP Headers

### Request Headers

Sent by the client (browser) to the server. Common examples:

| Header | Purpose | Example Value |
|---|---|---|
| `User-Agent` | Identifies the client browser/OS | `Mozilla/5.0 ...` |
| `Accept` | Content types the client can process | `application/json, text/plain` |
| `Authorization` | Credentials for authentication | `Bearer eyJhbGci...` |
| `Content-Type` | Media type of the request body | `application/json` |
| `Cookie` | Stored cookies sent to the server | `theme=dark; session=abc123` |

### Response Headers

Sent from the server back to the client. Common examples:

| Header | Purpose | Example Value |
|---|---|---|
| `Content-Type` | Media type of the response | `application/json` |
| `Set-Cookie` | Instructs the browser to store a cookie | `theme=dark; Path=/` |
| `Cache-Control` | Caching directives | `public, max-age=3600` |
| `Location` | Redirect URL | `/api/v2/users` |

## Reading Request Headers

Access headers from the `request.headers` object (standard `Headers` API).

```typescript
import { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const userAgent = request.headers.get("user-agent");
  const authHeader = request.headers.get("authorization");

  console.log("User-Agent:", userAgent);
  console.log("Authorization:", authHeader);

  return Response.json({ message: "Headers received" });
}
```

## Setting Response Headers

Use the `Headers` constructor to create custom response headers.

```typescript
import { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return new Response("Unauthorized", { status: 401 });
  }

  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("X-Custom-Header", "custom-value");

  return new Response(
    JSON.stringify({ message: "Authenticated" }),
    { status: 200, headers }
  );
}
```

## Using Headers() Helper

Next.js provides a `headers()` helper function that returns request headers as a `Headers` object.

```typescript
import { headers } from "next/headers";

export async function GET() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent");
  const referer = headersList.get("referer");

  return Response.json({
    userAgent,
    referer,
  });
}
```

## Checking for Specific Headers

```typescript
import { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = "Bearer 12345";

  if (!authHeader) {
    return Response.json(
      { error: "Missing authorization header" },
      { status: 401 }
    );
  }

  if (authHeader !== expectedToken) {
    return Response.json(
      { error: "Invalid token" },
      { status: 403 }
    );
  }

  return Response.json({ message: "Authenticated successfully" });
}
```

## Visual Flow

```
Client                    Server
  |                         |
  |-- GET /api/profile ----->|
  |   Headers:               |
  |     User-Agent: Chrome   |
  |     Accept: */*          |
  |     Authorization: Bearer|
  |                         |-- Read request.headers
  |                         |-- Set response headers
  |<---- Response ----------|
  |   Headers:              |
  |     Content-Type: json  |
  |     X-Custom-Header     |
```

## Key Points

- Use `request.headers.get("name")` to read a specific request header
- Use `new Headers()` to construct and `headers.set()` to add response headers
- The `headers()` helper from `next/headers` provides an alternative way to read request headers
- Header names are case-insensitive per HTTP spec
- Always validate headers before processing sensitive data

## Related Topics

- Cookies in Route Handlers
- Redirects in Route Handlers
- Caching in Route Handlers
