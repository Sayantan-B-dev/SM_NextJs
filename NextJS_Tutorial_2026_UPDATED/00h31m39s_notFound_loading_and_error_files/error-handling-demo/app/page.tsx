import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Error Handling Demo</h1>
      <p>Explore the special error, loading, and not-found files:</p>
      <ul>
        <li>
          <Link href="/posts">Posts list</Link> -- watch for <code>loading.tsx</code>
        </li>
        <li>
          <Link href="/posts/1">Post #1 (exists)</Link>
        </li>
        <li>
          <Link href="/posts/999">Post #999 (does not exist)</Link> -- triggers <code>notFound()</code>
        </li>
        <li>
          <Link href="/nonexistent">/nonexistent</Link> -- global <code>not-found.tsx</code>
        </li>
      </ul>
    </div>
  );
}
