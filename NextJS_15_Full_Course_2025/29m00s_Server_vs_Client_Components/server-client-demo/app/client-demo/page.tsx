"use client";

// This is a CLIENT COMPONENT (note "use client" at the top).
// Client components support:
//   - React Hooks (useState, useEffect, etc.)
//   - Event handlers (onClick, onSubmit, etc.)
//   - Browser APIs
// They ship JavaScript to the browser and hydrate on the client.

import { useState, useEffect } from "react";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export default function ClientDemoPage() {
  const [count, setCount] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This console.log appears in the BROWSER console, not the server terminal
  console.log("[Client Component] Component rendered on client");

  useEffect(() => {
    console.log("[Client Component] useEffect — fetching data...");

    fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: Post[]) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <main className="container">
      <h1 className="page-title">Client Component Demo</h1>
      <p className="page-subtitle">
        This page is a Client Component. It uses <code>useState</code>,
        <code> useEffect</code>, and <code>onClick</code>. JavaScript is shipped
        to the browser and the component is hydrated on the client.
      </p>

      <div className="info-box">
        <h3>Key Points</h3>
        <ul>
          <li>
            <code>&quot;use client&quot;</code> is declared at the top of this
            file.
          </li>
          <li>
            <code>useState</code> and <code>useEffect</code> work here.
          </li>
          <li>
            <code>onClick</code> and other event handlers work here.
          </li>
          <li>
            The console.log appears in the browser&apos;s developer console.
          </li>
          <li>
            Data fetching requires <code>useEffect</code> (cannot use direct
            <code> await</code> at the top level).
          </li>
        </ul>
      </div>

      <div className="card">
        <h2>Interactive Counter</h2>
        <p style={{ marginBottom: "1rem", color: "#94a3b8" }}>
          Uses <code>useState</code> and <code>onClick</code> — these only work
          in Client Components.
        </p>
        <p style={{ fontSize: "3rem", fontWeight: 700, color: "#facc15", marginBottom: "1rem" }}>
          {count}
        </p>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={() => setCount((c) => c + 1)}>+ Increment</button>
          <button onClick={() => setCount((c) => c - 1)}>- Decrement</button>
          <button onClick={() => setCount(0)}>Reset</button>
        </div>
      </div>

      <div className="card">
        <h2>Posts (fetched via useEffect)</h2>
        {loading && <p className="loading">Loading posts...</p>}
        {error && <div className="error-box">Error: {error}</div>}
        <div className="demo-data">
          {posts.map((post) => (
            <p key={post.id}>
              <strong>#{post.id}</strong> {post.title}
            </p>
          ))}
        </div>
      </div>
    </main>
  );
}
