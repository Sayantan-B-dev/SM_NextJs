import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div>
      <h1>404 --- Page Not Found</h1>
      <p>The page you are looking for does not exist or has been moved.</p>
      <Link href="/">Return to Home</Link>
    </div>
  );
}
