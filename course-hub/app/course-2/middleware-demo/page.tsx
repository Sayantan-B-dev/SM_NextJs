import Link from "next/link";

export default function MiddlewareDemoPage() {
  return (
    <div>
      <h1 className="page-title">Middleware Demo</h1>
      <p className="page-subtitle">
        Middleware runs before every request and can redirect, rewrite, or modify headers.
      </p>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3>What is Middleware?</h3>
        <p>
          Middleware is code that executes before a request is completed. It can inspect,
          block, redirect, or modify the incoming request before it reaches your route handler.
          The middleware.ts file at the project root exports a middleware function and a config
          object specifying which paths to match.
        </p>
      </div>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3>Try It</h3>
        <p>
          The link below goes to an admin dashboard. Without the <code>?role=admin</code> query
          parameter, the middleware will redirect you back here.
        </p>
        <div style={{ marginTop: "1rem" }}>
          <Link href="/course-2/middleware-demo/admin" className="btn">
            Go to Admin Dashboard (no role)
          </Link>
        </div>
        <div style={{ marginTop: "0.75rem" }}>
          <Link href="/course-2/middleware-demo/admin?role=admin" className="btn btn-outline">
            Go to Admin Dashboard (with role)
          </Link>
        </div>
      </div>
    </div>
  );
}
