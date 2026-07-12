import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1 className="page-title">Page Not Found</h1>
      <p className="page-subtitle">
        The page you are looking for does not exist in this section.
      </p>
      <Link href="/course-3" className="btn">
        Back to Course 3
      </Link>
    </div>
  );
}
