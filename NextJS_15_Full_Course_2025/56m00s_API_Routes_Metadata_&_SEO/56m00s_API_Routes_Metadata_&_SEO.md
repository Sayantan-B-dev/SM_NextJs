# API Routes, Metadata, and SEO in Next.js 15

## Overview

This document covers three interconnected topics: creating API routes inside the `app/` directory, managing metadata for SEO, and understanding how layouts compose across nested routes. It also demonstrates how client and server components interact with API routes.

---

## 1. Layout Composition Recap

### 1.1 Nested Layouts

Layouts are defined by `layout.tsx` files and wrap all pages within their segment and below. They persist across navigations.

```
app/
  layout.tsx             # Root layout (applies to all routes)
  users/
    layout.tsx           # Users layout (applies to /users and /users/verified)
    verified/
      layout.tsx         # Verified users layout (applies to /users/verified only)
      page.tsx
    page.tsx
  about/
    page.tsx             # Does NOT inherit users layout
```

```tsx
// app/users/layout.tsx
export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <aside>Users Navigation</aside>
      <main>{children}</main>
    </section>
  );
}
```

The `/about` route will use the root layout but NOT the users layout. The `/users/verified` route will use root + users + verified layouts.

---

## 2. API Routes in the App Router

### 2.1 Route Handlers

API routes are defined using `route.ts` files (not `page.tsx`) inside `app/api/`. The file-based routing convention applies.

```
app/
  api/
    users/
      route.ts       # Handles /api/users
      [id]/
        route.ts     # Handles /api/users/123
```

### 2.2 HTTP Method Handlers

Export named functions for each HTTP method:

```tsx
// app/api/hello/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello from the API" });
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ received: body, timestamp: new Date().toISOString() });
}
```

### 2.3 Request and Response

```tsx
// app/api/users/route.ts
import { NextResponse } from "next/server";

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newUser = { id: users.length + 1, ...body };
    users.push(newUser);
    return NextResponse.json(newUser, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
```

### 2.4 Route Parameters in API Routes

```tsx
// app/api/users/[id]/route.ts
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  const user = await res.json();
  return NextResponse.json(user);
}
```

---

## 3. Calling API Routes from the Frontend

### 3.1 From Client Components

```tsx
"use client";
import { useState } from "react";

export default function CreateUserForm() {
  const [result, setResult] = useState(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
      }),
    });

    const data = await res.json();
    setResult(data);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit">Create User</button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </form>
  );
}
```

### 3.2 From Server Components

Server components cannot use relative URLs for API routes because they run on the server. Use an environment variable for the base URL:

```tsx
// .env.local
NEXT_PUBLIC_URL=http://localhost:3000

// app/users/page.tsx (server component)
async function getUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users`);
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();
  // render users...
}
```

**Alternative:** Fetch the data source directly in the server component rather than calling your own API route.

### 3.3 Client Components (No env needed)

Client components use relative URLs seamlessly:

```tsx
// In a client component
const res = await fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
const result = await res.json();
```

---

## 4. Metadata and SEO

### 4.1 What is Metadata?

Metadata provides information about a page to search engines and social media platforms:

| Property | Purpose |
|----------|---------|
| `title` | Browser tab title and search result headline |
| `description` | Search result snippet |
| `keywords` | SEO keywords (mostly ignored by modern crawlers) |
| `openGraph` | Social media preview cards (Facebook, LinkedIn) |
| `twitter` | Twitter card configuration |

### 4.2 Static Metadata

Export a `metadata` object from any `layout.tsx` or `page.tsx` file:

```tsx
// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Application",
  description: "A full-stack Next.js application with API routes and SEO",
  keywords: ["nextjs", "react", "typescript", "full-stack"],
  openGraph: {
    title: "My Application",
    description: "A full-stack Next.js application",
    type: "website",
    url: "https://myapp.com",
  },
};
```

Page-specific metadata overrides parent layout metadata for that property:

```tsx
// app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",  // Overrides the root title for this page
  description: "Learn more about our team and mission",
};
```

### 4.3 Dynamic Metadata with `generateMetadata`

For pages that depend on route parameters or fetched data, use `generateMetadata`:

```tsx
// app/users/[userId]/page.tsx
import type { Metadata } from "next";

async function getUser(id: string) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> {
  const { userId } = await params;
  const user = await getUser(userId);

  return {
    title: `${user.name} -- User Profile`,
    description: `View the profile of ${user.name}. Contact them at ${user.email}.`,
    openGraph: {
      title: `${user.name} -- User Profile`,
      description: `Profile of ${user.name}`,
    },
  };
}
```

### 4.4 Client Component Limitation

**Metadata cannot be exported from client components.** Only Server Components (components without `"use client"`) can export `metadata` or `generateMetadata`.

If you need SEO metadata on a page that uses client-side interactivity, keep the client logic in a child component and export metadata from the parent server component:

```tsx
// app/dashboard/page.tsx -- SERVER COMPONENT
import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personal dashboard",
};

export default function DashboardPage() {
  return <DashboardClient />;
}

// app/dashboard/DashboardClient.tsx -- CLIENT COMPONENT
"use client";
export default function DashboardClient() {
  return <div>{/* interactive content */}</div>;
}
```

---

## 5. Complete Working Examples

### 5.1 Basic API Route with CRUD

```tsx
// app/api/users/route.ts
import { NextResponse } from "next/server";

interface User {
  id: number;
  name: string;
  email: string;
}

let users: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com" },
  { id: 2, name: "Bob Smith", email: "bob@example.com" },
];

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newUser: User = {
    id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    name: body.name,
    email: body.email,
  };
  users.push(newUser);
  return NextResponse.json(newUser, { status: 201 });
}
```

### 5.2 Single Resource API Route

```tsx
// app/api/users/[id]/route.ts
import { NextResponse } from "next/server";

interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com" },
  { id: 2, name: "Bob Smith", email: "bob@example.com" },
];

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = users.find((u) => u.id === Number(id));

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = users.findIndex((u) => u.id === Number(id));

  if (index === -1) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const deleted = users.splice(index, 1)[0];
  return NextResponse.json({ message: "User deleted", user: deleted });
}
```

---

## 6. Key Takeaways

- **API Routes** are defined in `app/api/` using `route.ts` files with named exports for HTTP methods
- **Request** provides access to body, headers, and query parameters
- **NextResponse.json()** simplifies JSON responses with typed status codes
- **Route parameters** in API routes are Promises (same as page components in Next.js 15)
- **Client components** can call API routes with relative URLs (`/api/users`)
- **Server components** need the full URL (use `process.env.NEXT_PUBLIC_URL`)
- **Static metadata** is exported as a `metadata` object from server components
- **Dynamic metadata** uses `generateMetadata` with async data fetching
- **Client components** cannot export metadata -- keep the metadata export in a parent server component
