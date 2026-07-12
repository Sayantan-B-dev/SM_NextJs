import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Dynamic Routes and Loading States</h1>
      <p>
        This application demonstrates key Next.js 15 concepts including dynamic
        routing with Promise-based params, loading states via loading.tsx,
        custom not-found pages, and error boundaries.
      </p>
      <h2>Features</h2>
      <ul>
        <li>
          <Link href="/users">
            User List -- fetches all users from JSONPlaceholder API
          </Link>
        </li>
        <li>
          Dynamic user pages at <code>/users/[userId]</code> with loading,
          not-found, and error states
        </li>
        <li>
          Global 404 page for unmatched routes
        </li>
      </ul>
    </div>
  );
}
