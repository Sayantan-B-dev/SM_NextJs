import Link from "next/link";

export default function Course2Home() {
  return (
    <div>
      <h1 className="page-title">Course 2: Advanced Next.js</h1>
      <p className="page-subtitle">
        Based on the NextJS Tutorial 2026 UPDATED -- covering middleware, server actions,
        caching, route handlers, Prisma, and deployment.
      </p>

      <div className="grid-2">
        <Link href="/course-2/middleware-demo" className="card" style={{ textDecoration: "none" }}>
          <h2>Middleware & Proxy</h2>
          <p>Redirects, rewrites, header modifications, route protection with middleware.ts.</p>
        </Link>
        <Link href="/course-2/server-actions" className="card" style={{ textDecoration: "none" }}>
          <h2>Server Actions</h2>
          <p>Form handling with server actions, revalidation, and progressive enhancement.</p>
        </Link>
        <Link href="/course-2/caching-demo" className="card" style={{ textDecoration: "none" }}>
          <h2>Caching Strategies</h2>
          <p>Data cache, full route cache, revalidation with revalidatePath and revalidateTag.</p>
        </Link>
        <Link href="/course-2/prisma-demo" className="card" style={{ textDecoration: "none" }}>
          <h2>Prisma & Database</h2>
          <p>Database integration with Prisma and SQLite, server-side data access.</p>
        </Link>
      </div>
    </div>
  );
}