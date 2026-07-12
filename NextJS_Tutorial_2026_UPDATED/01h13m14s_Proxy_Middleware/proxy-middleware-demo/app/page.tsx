import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>Middleware Demo</h1>
      <p>
        This app demonstrates Next.js middleware. The middleware checks for a
        <code>session</code> cookie when accessing the <code>/admin</code> page.
      </p>
      <ul>
        <li>
          <Link href="/admin">Go to /admin (protected by middleware)</Link>
        </li>
        <li>
          <Link href="/">Home (no middleware)</Link>
        </li>
      </ul>
      <h2>How to Test</h2>
      <ol>
        <li>Visit <code>/admin</code> without a session cookie -- you will be redirected to <code>/login</code>.</li>
        <li>Set a cookie named <code>session</code> with any value (e.g., via browser DevTools), then visit <code>/admin</code> again.</li>
      </ol>
    </div>
  );
}
