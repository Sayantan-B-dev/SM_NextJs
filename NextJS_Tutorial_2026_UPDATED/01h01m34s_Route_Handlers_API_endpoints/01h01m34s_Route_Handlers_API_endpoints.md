# Route Handlers (API Endpoints)

Route Handlers allow you to create API endpoints inside the `app/` directory using `route.ts` files. They are the App Router equivalent of API Routes in the Pages Router and provide a way to handle HTTP requests directly on the server.

---

## 1. Basic Route Handler Structure

A Route Handler is a `route.ts` file that exports async functions named after HTTP methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, and `OPTIONS`.

```typescript
// app/api/hello/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello, world!' });
}
```

### Request and Response Types

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ ok: true });
}
```

- `NextRequest` extends the Web `Request` API with convenience methods (cookies, geolocation, nextUrl).
- `NextResponse` extends the Web `Response` API with helpers like `.json()`, `.redirect()`, `.rewrite()`.

---

## 2. HTTP Method Exports

| HTTP Method | Exported Function | Common Use Case |
|---|---|---|
| GET | `export async function GET()` | Fetch data, read resources |
| POST | `export async function POST()` | Create resources, webhooks |
| PUT | `export async function PUT()` | Replace resources entirely |
| PATCH | `export async function PATCH()` | Partial updates |
| DELETE | `export async function DELETE()` | Remove resources |

```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';

const posts = [
  { id: '1', title: 'Getting Started with Next.js', content: '...' },
  { id: '2', title: 'Understanding Server Components', content: '...' },
];

export async function GET() {
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newPost = { id: String(posts.length + 1), ...body };
  posts.push(newPost);
  return NextResponse.json(newPost, { status: 201 });
}
```

---

## 3. Dynamic Route Handlers

For resources with IDs, use dynamic segments in brackets, just like pages.

```typescript
// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = posts.find((p) => p.id === params.id);
  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const index = posts.findIndex((p) => p.id === params.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  posts.splice(index, 1);
  return NextResponse.json({ success: true });
}
```

### Accessing Search Params

```typescript
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') ?? '1';
  const limit = searchParams.get('limit') ?? '10';
  // ...
}
```

---

## 4. Route Handlers vs Server Actions

| Aspect | Route Handlers | Server Actions |
|---|---|---|
| Invocation | HTTP request (fetch, curl, browser) | Form action, `startTransition`, programmatic |
| Returns | JSON, text, blob | Response (JSON or form-data) or revalidation |
| Cookies/Headers | Full control with `NextRequest/NextResponse` | Limited control via `cookies()` and `headers()` |
| Caching | Follows `fetch` caching rules | Data is always dynamic |
| Best for | Webhooks, external API calls, third-party integrations | Form submissions, UI-bound mutations |

### When to Use Route Handlers

- **Webhooks** -- Stripe, Clerk, Kinde, CMS callbacks.
- **External API proxies** -- Forward requests to third-party services, adding auth tokens on the server.
- **File uploads** -- Handle multipart form data.
- **Server-Sent Events (SSE)** or long-polling.
- **Integrations** that expect a REST endpoint (mobile apps, external services).

### When to Use Server Actions

- **Form submissions** -- Blog comments, contact forms, newsletter signups.
- **UI mutations** -- Upvote buttons, inline edits, toggles.
- **Optimistic updates** -- Instant UI feedback while data saves.

---

## 5. Example: Stripe Webhook

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      // Grant access, update database
      break;
    case 'invoice.paid':
      // Handle invoice
      break;
  }

  return NextResponse.json({ received: true });
}
```

### Example: CMS Webhook with Revalidation

```typescript
// app/api/webhooks/cms/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CMS_WEBHOOK_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { event, slug } = await request.json();

  if (event === 'post.published') {
    revalidatePath(`/blog/${slug}`);
    revalidateTag('posts');
  }

  return NextResponse.json({ revalidated: true });
}
```

---

## 6. Securing API Routes

### Authentication / Session Check

```typescript
// app/api/posts/route.ts
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
// or use NextAuth:
// import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getKindeServerSession();
  const user = await session.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const post = await createPost({ ...body, authorId: user.id });
  return NextResponse.json(post, { status: 201 });
}
```

### CORS Headers

When your API is called from a different origin:

```typescript
// app/api/posts/route.ts
export async function GET() {
  const data = await getPosts();

  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function OPTIONS() {
  return NextResponse.json(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

### Rate Limiting

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10s'),
});

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  // ...
}
```

---

## 7. Static and Dynamic Behavior

By default, Route Handlers are **dynamic** -- they are evaluated on every request. To make a Route Handler static, export a `dynamic` variable:

```typescript
export const dynamic = 'force-static';

export async function GET() {
  const data = await fetch('https://api.example.com/data');
  return NextResponse.json(await data.json());
}
```

To revalidate a static Route Handler on a schedule:

```typescript
export const revalidate = 60; // seconds

export async function GET() {
  // ...
}
```

Or use `revalidatePath()` / `revalidateTag()` for on-demand revalidation.

---

## 8. Edge Runtime

Route Handlers default to the Node.js runtime. To run on the Edge:

```typescript
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  return NextResponse.json({ runtime: 'edge' });
}
```

Edge is faster globally but has fewer Node.js APIs available (`fs`, `crypto` extensions, etc.).

---

## 9. Summary

- Create API endpoints with `route.ts` files under `app/api/`.
- Export named functions: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- Use `NextRequest` and `NextResponse` for full control.
- Use dynamic segments (`[id]`) for resource-specific routes.
- Route Handlers are ideal for webhooks, third-party callbacks, and REST APIs.
- Server Actions are better for UI-bound mutations.
- Secure your routes with authentication checks, CORS headers, and rate limiting.
- Consider the Edge runtime for globally distributed, low-latency APIs.
