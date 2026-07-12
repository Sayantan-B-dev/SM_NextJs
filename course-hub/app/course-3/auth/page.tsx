import Link from "next/link";

export default function AuthPage() {
  return (
    <div>
      <h1 className="page-title">Authentication</h1>
      <p className="page-subtitle">
        Session-based authentication with cookies, login flows, and route
        protection using server actions.
      </p>
      <div className="grid-2">
        <Link
          href="/course-3/auth/login"
          className="card"
          style={{ textDecoration: "none" }}
        >
          <h3>Login</h3>
          <p>
            Mock login form that sets a session cookie via a server action and
            redirects to the dashboard.
          </p>
        </Link>
        <Link
          href="/course-3/auth/dashboard"
          className="card"
          style={{ textDecoration: "none" }}
        >
          <h3>Dashboard</h3>
          <p>
            Protected dashboard that checks for a valid session cookie. If
            missing, shows an unauthenticated message.
          </p>
        </Link>
      </div>
    </div>
  );
}
