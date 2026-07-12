# Authentication

Authentication in Next.js involves verifying a user's identity and controlling access to routes, data, and actions. This guide covers authentication approaches, protecting different layers of your application, and working with popular auth providers.

---

## 1. Authentication Approaches

### Auth Providers (Recommended)

Using a dedicated authentication service is strongly recommended over building auth from scratch. These services handle:

- User registration and login flows
- Password hashing and security
- Session and token management
- Social login (Google, GitHub, etc.)
- MFA, password reset, email verification

| Provider | Next.js Integration | Features |
|---|---|---|
| **NextAuth.js (Auth.js)** | `next-auth` | Built for Next.js, database adapters, multiple providers |
| **Kinde** | `@kinde-oss/kinde-auth-nextjs` | Quick setup, hosted UI, free tier |
| **Clerk** | `@clerk/nextjs` | Pre-built components, webhooks, organization support |
| **Supabase Auth** | `@supabase/supabase-js` | Built-in with Supabase, Row Level Security |
| **Lucia** | `lucia-auth` | Lightweight, unopinionated framework |
| **Firebase Auth** | `firebase` | Google ecosystem, simple setup |

### Self-Built Auth

You can build authentication from scratch using:

- `bcrypt` for password hashing
- `jsonwebtoken` for JWT creation/verification
- `cookies()` and `headers()` from `next/headers` for session management
- Database for storing users and sessions

However, this is error-prone and not recommended for production unless you have specific security requirements.

---

## 2. Token Types

When using an auth provider, you will encounter several token types:

| Token | Purpose | Lifespan |
|---|---|---|
| **Access Token** | Authorizes API requests | Short (15 min - 1 hour) |
| **ID Token** | Contains user identity claims (OpenID Connect) | Short |
| **Refresh Token** | Obtains new access tokens without re-login | Long (days/weeks) |

Most Next.js auth libraries handle token refresh transparently.

---

## 3. Protecting Routes

### Middleware-Based Protection

Middleware checks auth status before the request reaches the page.

```typescript
// middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow auth-related routes and public pages
  if (
    pathname.startsWith('/api/auth') ||
    pathname === '/login' ||
    pathname === '/register'
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });

  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
```

### Using Kinde

```typescript
// middleware.ts
import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';

export default withAuth({
  // Redirect here if not authenticated
  loginPage: '/login',
  // Skip auth check for these paths
  isReturnToCurrentPage: true,
});

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
```

---

## 4. Protecting API Routes (Route Handlers)

API endpoints should verify authentication before returning data.

```typescript
// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
// -- or --
// import { auth } from '@/lib/auth'; // NextAuth v5

export async function GET() {
  // Kinde
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch user-specific data
  const posts = await getPostsByUser(user.id);
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  // NextAuth v5
  // const session = await auth();
  // if (!session?.user) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  const { isAuthenticated } = getKindeServerSession();
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  // ... create post
  return NextResponse.json({ success: true }, { status: 201 });
}
```

---

## 5. Protecting Server Actions

Server Actions should check authentication before performing mutations.

```typescript
// app/actions.ts
'use server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error('You must be logged in to create a post');
  }

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  const post = await db.post.create({
    data: { title, content, authorId: user.id },
  });

  revalidatePath('/posts');
  return { success: true, id: post.id };
}

export async function deletePost(postId: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const post = await db.post.findUnique({ where: { id: postId } });
  if (!post || post.authorId !== user.id) {
    throw new Error('Not authorized to delete this post');
  }

  await db.post.delete({ where: { id: postId } });
  revalidatePath('/posts');
}
```

---

## 6. Protecting the Data Access Layer

The most secure approach is to protect access at the data layer -- not just the UI or API. This ensures that even if a server component or server action is accidentally rendered without auth checks, the data is still protected.

```typescript
// lib/data.ts
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function getPostsForCurrentUser() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    // Return empty data instead of throwing
    // This prevents leaking information about what exists
    return [];
  }

  return db.post.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPost(id: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const post = await db.post.findUnique({ where: { id } });

  // Check ownership
  if (!post || post.authorId !== user?.id) {
    return null; // Pretend the post doesn't exist
  }

  return post;
}
```

---

## 7. Distribution of Authentication Checks

Instead of checking auth everywhere, organize your checks at the right layers:

```
Client Component
    |
    v
Server Action / Route Handler  <-- Auth check 1 (required)
    |
    v
Data Access Layer              <-- Auth check 2 (defense in depth)
    |
    v
Database
```

### Example: Server Component with Auth

```typescript
// app/dashboard/page.tsx
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect('/login');
  }

  const user = await getUser();
  const posts = await db.post.findMany({
    where: { authorId: user.id },
  });

  return (
    <div>
      <h1>Welcome, {user.given_name}</h1>
      {/* ... */}
    </div>
  );
}
```

---

## 8. Auth Flow Example: NextAuth.js (v5 / Auth.js)

### Installation

```bash
npm install next-auth@beta @auth/prisma-adapter
```

### Configuration

```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GitHub, Google],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
```

### Route Handler for Auth Endpoints

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
```

### Protecting a Route Handler

```typescript
// app/api/user/posts/route.ts
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const posts = await getPostsByUserId(session.user.id);
  return NextResponse.json(posts);
}
```

---

## 9. Auth Flow Example: Kinde

### Installation

```bash
npm install @kinde-oss/kinde-auth-nextjs
```

### Environment Variables

```env
KINDE_CLIENT_ID=your_client_id
KINDE_CLIENT_SECRET=your_client_secret
KINDE_ISSUER_URL=https://your-domain.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard
```

### Implementing Auth

```typescript
// app/api/auth/[kindeAuth]/route.ts
import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server';

export const GET = handleAuth();
```

```typescript
// app/api/login/route.ts
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/components';

// Or programmatically:
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function GET() {
  const { login } = getKindeServerSession();
  return login();
}
```

### Checking Auth in Server Components

```typescript
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export default async function ProtectedPage() {
  const { isAuthenticated, getUser } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    // Handle unauthenticated state
    return <p>Please log in to view this page.</p>;
  }

  const user = await getUser();
  return <p>Welcome, {user.given_name}!</p>;
}
```

---

## 10. Redirect Patterns

### After Login

```typescript
// Server Action for login
export async function loginAction(prevState: any, formData: FormData) {
  // Validate credentials
  // Create session
  // Redirect user back to the page they were trying to access
  redirect('/dashboard');
}
```

### Preserve Return URL

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('session')?.value;

  if (!token && pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
```

```typescript
// app/login/page.tsx
import { redirect } from 'next/navigation';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  async function handleLogin(formData: FormData) {
    'use server';
    // Authenticate...
    redirect(searchParams.redirect ?? '/dashboard');
  }

  return (
    <form action={handleLogin}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Log In</button>
    </form>
  );
}
```

---

## 11. Environment Variables for Auth

| Variable | Description |
|---|---|
| `AUTH_SECRET` / `NEXTAUTH_SECRET` | Secret key for encrypting sessions/JWT |
| `AUTH_GITHUB_ID` | GitHub OAuth App client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App client secret |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `KINDE_CLIENT_ID` | Kinde client ID |
| `KINDE_CLIENT_SECRET` | Kinde client secret |
| `KINDE_ISSUER_URL` | Kinde tenant URL |

These should all be kept secret and never committed to git.

---

## 12. Summary

- Use established auth libraries (NextAuth.js, Kinde, Clerk) instead of building from scratch.
- Protect routes with middleware; protect data with Server Actions/Route Handlers and the data access layer.
- Implement **defense in depth**: check auth at multiple layers (middleware, server actions, data access).
- Use the data access layer as the final gate to prevent accidental data leaks.
- Store auth-related environment variables securely on your hosting platform.
- Redirect users back to their intended page after login using a `redirect` search param.
