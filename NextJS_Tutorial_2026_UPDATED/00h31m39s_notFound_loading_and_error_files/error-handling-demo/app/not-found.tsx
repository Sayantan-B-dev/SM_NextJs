import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
      <h1 style={{ fontSize: "4rem", margin: 0 }}>404</h1>
      <p>This page could not be found.</p>
      <Link href="/">Return home</Link>
    </div>
  );
}
