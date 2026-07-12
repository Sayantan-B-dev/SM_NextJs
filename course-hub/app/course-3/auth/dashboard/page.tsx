import { cookies } from "next/headers";
import Link from "next/link";

export default async function AuthDashboardPage() {
  const session = (await cookies()).get("session");

  if (!session || session.value !== "true") {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1 className="page-title">Not Authenticated</h1>
        <p className="page-subtitle">
          You must be logged in to view this page.
        </p>
        <Link href="/course-3/auth/login" className="btn">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Welcome! You are authenticated.</p>
      <div className="card">
        <h3>Protected Content</h3>
        <p>
          This content is only visible to authenticated users. The session
          cookie was set by the login server action.
        </p>
        <ul>
          <li>Session cookie is httpOnly and secure</li>
          <li>Expires in 24 hours</li>
          <li>Checked server-side via cookies()</li>
        </ul>
      </div>
    </div>
  );
}
