import Link from "next/link";

export default function Course3Home() {
  return (
    <div>
      <h1 className="page-title">Course 3: Production Next.js</h1>
      <p className="page-subtitle">
        Based on the 92-tutorial Next.js 15 course -- covering data fetching, error handling,
        parallel routes, server actions, authentication, and deployment.
      </p>

      <div className="grid-2">
        <Link href="/course-3/data-fetching" className="card" style={{ textDecoration: "none" }}>
          <h2>Data Fetching Patterns</h2>
          <p>Server-side fetching, sequential and parallel data loading, loading states.</p>
        </Link>
        <Link href="/course-3/error-handling" className="card" style={{ textDecoration: "none" }}>
          <h2>Error Handling</h2>
          <p>Error boundaries, recovery, nested route errors, global error pages.</p>
        </Link>
        <Link href="/course-3/parallel-routes" className="card" style={{ textDecoration: "none" }}>
          <h2>Parallel & Intercepting Routes</h2>
          <p>Dashboard with parallel slots, unmatched route handling, modal patterns.</p>
        </Link>
        <Link href="/course-3/auth" className="card" style={{ textDecoration: "none" }}>
          <h2>Authentication & RBAC</h2>
          <p>Login flow, route protection, role-based access, session management.</p>
        </Link>
      </div>
    </div>
  );
}