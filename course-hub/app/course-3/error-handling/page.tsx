import Link from "next/link";

export default function ErrorHandlingPage() {
  return (
    <div>
      <h1 className="page-title">Error Handling</h1>
      <p className="page-subtitle">
        Next.js error boundaries, recovery patterns, and custom 404 pages.
      </p>
      <div className="grid-2">
        <Link
          href="/course-3/error-handling/error-trigger"
          className="card"
          style={{ textDecoration: "none" }}
        >
          <h3>Trigger an Error</h3>
          <p>
            Click to navigate to a page that intentionally throws an error,
            demonstrating the error.tsx boundary.
          </p>
        </Link>
        <Link
          href="/course-3/error-handling/nonexistent-route"
          className="card"
          style={{ textDecoration: "none" }}
        >
          <h3>Trigger a 404</h3>
          <p>
            Navigate to a non-existent route to demonstrate the not-found.tsx
            page.
          </p>
        </Link>
      </div>
    </div>
  );
}
