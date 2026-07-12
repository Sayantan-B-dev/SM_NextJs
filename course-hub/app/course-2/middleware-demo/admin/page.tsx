import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-subtitle">
        You have access because the <code>?role=admin</code> parameter was present.
      </p>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3>Protected Content</h3>
        <p>
          The middleware checked for the admin role before allowing this page to render.
          Without it, you would have been redirected to the middleware demo home page.
        </p>
      </div>

      <Link href="/course-2/middleware-demo" className="btn btn-outline">
        Back to Middleware Demo
      </Link>
    </div>
  );
}
