# Full Next.js 15 Application

A comprehensive demonstration of Next.js 15 features including API routes, metadata and SEO, layout composition, dynamic routing, and client-server component interaction.

## Project Structure

```
full-nextjs-app/
  app/
    layout.tsx             # Root layout with navigation and global metadata
    page.tsx               # Home page with overview of all features
    globals.css            # Global styles
    not-found.tsx          # Global 404 page

    about/
      page.tsx             # About page with static metadata

    users/
      page.tsx             # Server component fetching all users from JSONPlaceholder
      [userId]/
        page.tsx           # Dynamic user page with generateMetadata

    client-demo/
      page.tsx             # Client component that calls API routes

    api/
      users/
        route.ts           # GET all users, POST new user (in-memory store)
        [id]/
          route.ts         # GET single user, DELETE user

  next.config.ts           # Configuration with redirects
  package.json
  tsconfig.json
  .gitignore
  README.md
```

## How It Works

### Routing

- The **App Router** uses a file-system based routing convention
- `app/page.tsx` maps to `/`
- `app/about/page.tsx` maps to `/about`
- `app/users/page.tsx` maps to `/users`
- `app/users/[userId]/page.tsx` maps to `/users/1`, `/users/2`, etc.
- `app/client-demo/page.tsx` maps to `/client-demo`

### Layouts

- `app/layout.tsx` is the **root layout** that wraps all pages
- It provides a navigation bar and applies global styles
- Metadata exported from the root layout serves as defaults for all pages

### API Routes

API routes are defined using `route.ts` files inside `app/api/`:

| File | Endpoint | Methods | Description |
|------|----------|---------|-------------|
| `app/api/users/route.ts` | `/api/users` | GET, POST | List all users / create new user |
| `app/api/users/[id]/route.ts` | `/api/users/{id}` | GET, DELETE | Get single user / delete user |

The API uses an **in-memory array** as a data store. On server restart (or in production), the data resets.

#### Example: GET all users

```tsx
// app/api/users/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(users);
}
```

#### Example: POST new user

```tsx
export async function POST(req: Request) {
  const body = await req.json();
  const newUser = { id: nextId(), name: body.name, email: body.email };
  users.push(newUser);
  return NextResponse.json(newUser, { status: 201 });
}
```

#### Example: GET user by ID

```tsx
// app/api/users/[id]/route.ts
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = users.find(u => u.id === Number(id));
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}
```

### Metadata and SEO

Next.js provides two ways to manage page metadata:

1. **Static Metadata** -- Export a `metadata` object:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about our team",
  keywords: ["nextjs", "react"],
};
```

2. **Dynamic Metadata** -- Use `generateMetadata` for data-driven SEO:

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> {
  const { userId } = await params;
  const user = await fetchUser(userId);
  return {
    title: `${user.name} -- User Profile`,
    description: `Profile of ${user.name}`,
  };
}
```

**Important:** Metadata can only be exported from Server Components. Client components (those with `"use client"`) cannot use `metadata` or `generateMetadata`.

### Server Components vs Client Components

| Aspect | Server Component | Client Component |
|--------|-----------------|-----------------|
| Rendering | On the server | In the browser |
| Data fetching | Direct `await fetch()` | `useEffect` or React Query |
| Metadata | Supported | Not supported |
| State/Effects | Not supported | Supported (useState, useEffect) |
| API calls | Use full URL or fetch data source directly | Use relative URLs (`/api/...`) |

#### Data Flow Diagram

```
Browser Request
      |
      v
Server Component (app/users/page.tsx)
  - Fetches data directly from JSONPlaceholder (server-side)
  - No need to call own API routes from server
  - Returns fully rendered HTML
      |
      v
Client Component (app/client-demo/page.tsx)
  - Has "use client" directive
  - Calls /api/users with relative URL (works from browser)
  - Uses useState for reactive updates
  - Uses useEffect for initial data load
      |
      v
API Route (app/api/users/route.ts)
  - Runs on the server
  - Handles HTTP methods (GET, POST)
  - Returns NextResponse.json()
```

### Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application runs on `http://localhost:3000`.

## Key Lessons

1. **API Routes** use the same file-based routing as pages, but with `route.ts` files
2. **Route parameters** in both pages and API routes are Promises in Next.js 15
3. **Metadata** improves SEO and must be exported from server components only
4. **Client components** can call API routes with relative URLs and handle state
5. **Server components** fetch data directly without needing to hit your own API
6. **Layouts** compose hierarchically and share metadata defaults with child pages
