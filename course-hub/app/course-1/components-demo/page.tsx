import Link from "next/link";
import Counter from "./counter";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// SERVER COMPONENT
// This component runs on the server. It can be async and fetch data directly.
// The result is rendered on the server and sent as static HTML to the client.
export default async function ComponentsDemo() {
  let posts: Post[] = [];
  let error: string | null = null;

  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    posts = await res.json();
  } catch {
    error = "Failed to fetch posts";
  }

  return (
    <div>
      <h1 className="page-title">Server vs Client Components</h1>
      <p className="page-subtitle">
        Understanding the difference between server and client components, async
        data fetching, and the composition pattern.
      </p>

      <div className="grid-2">
        {/* SERVER COMPONENT SECTION */}
        <div className="card">
          <h2>Server Component (default)</h2>
          <p style={{ marginBottom: "1rem", color: "#94a3b8" }}>
            This component is a <strong>server component</strong>. It runs on the
            server, can be <code>async</code>, and fetches data from JSONPlaceholder
            directly. No client-side JavaScript is shipped for the fetch logic.
          </p>
          <pre>
            <code>{`export default async function Page() {
  const res = await fetch("https://...");
  const posts = await res.json();
  return <div>{posts.map(...)}</div>;
}`}</code>
          </pre>

          {error ? (
            <p style={{ color: "#f87171" }}>{error}</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {posts.map((post) => (
                <li
                  key={post.id}
                  style={{
                    padding: "0.75rem",
                    marginBottom: "0.5rem",
                    background: "#0f172a",
                    borderRadius: "0.375rem",
                    border: "1px solid #334155",
                  }}
                >
                  <strong style={{ color: "#a78bfa" }}>{post.title}</strong>
                  <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                    {post.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* CLIENT COMPONENT SECTION */}
        <Counter />
      </div>

      <div className="card" style={{ marginTop: "1.5rem" }}>
        <h2>Composition Pattern</h2>
        <p>
          The server component wraps a client component (<code>Counter</code>).
          The server handles data fetching and renders the outer shell; the client
          component is imported and hydrated on the browser for interactivity. This
          pattern keeps most of the app on the server while isolating interactivity
          to small client boundaries.
        </p>
      </div>

      <Link href="/course-1" className="btn" style={{ marginTop: "1.5rem", display: "inline-block" }}>
        Back to Course 1
      </Link>
    </div>
  );
}
