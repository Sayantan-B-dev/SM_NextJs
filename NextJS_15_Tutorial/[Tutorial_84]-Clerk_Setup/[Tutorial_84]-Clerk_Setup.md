## Clerk Setup

Setting up Clerk in a Next.js application requires creating a Clerk account, installing the package, configuring environment variables, adding middleware, and wrapping the application with the Clerk provider.

### Step 1: Create a Clerk Account

1. Go to the Clerk homepage and click **Get Started**.
2. Create an account using email, Google, or GitHub.
3. Verify your email with the verification code.
4. Click **Create Application** and name it (e.g., "Next.js Application").
5. Select sign-in options (e.g., email + password, Google, GitHub).
6. Click **Create Application**.

### Step 2: Install Clerk

```bash
npm install @clerk/nextjs
```

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root of your project:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxx
```

These keys are found on the Clerk setup instructions page after creating your application.

### Step 4: Create Middleware

Create `middleware.ts` in the `src/` folder:

```typescript
// src/middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
```

### Step 5: Wrap Application with ClerkProvider

In the root layout, wrap your application with `ClerkProvider`:

```tsx
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js 15 Tutorial",
  description: "Authentication with Clerk",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### Verification

After completing these steps, Clerk is fully integrated into your Next.js application and ready for authentication features.
