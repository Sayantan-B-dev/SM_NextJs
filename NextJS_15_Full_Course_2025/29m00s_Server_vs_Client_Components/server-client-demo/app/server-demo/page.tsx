// This is a SERVER COMPONENT (default — no "use client" directive)
// Server components can be async and fetch data directly.
// They do NOT support: hooks (useState, useEffect), event handlers (onClick),
// or any browser APIs. No JavaScript is shipped to the browser for this component.

import { JSX } from "react";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export default async function ServerDemoPage() {
  // Direct await — no useEffect needed
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=10"
  );
  const posts: Post[] = await res.json();

  // This console.log appears in the SERVER terminal, NOT the browser console
  console.log("[Server Component] Fetched", posts.length, "posts");

  return (
    <main className="container">
      <h1 className="page-title">Server Component Demo</h1>
      <p className="page-subtitle">
        This page is a Server Component. Data was fetched on the server with
        direct <code>await</code>. No JavaScript was sent to the browser for
        this component.
      </p>

      <div className="info-box">
        <h3>Key Points</h3>
        <ul>
          <li>
            This component is <code>async</code> — it uses{" "}
            <code>await fetch()</code> directly.
          </li>
          <li>
            No <code>useState</code>, <code>useEffect</code>, or any hooks are
            needed.
          </li>
          <li>
            The HTML is fully rendered on the server and sent to the client.
          </li>
          <li>
            Check your terminal — the console.log from this component appears
            there, not in the browser.
          </li>
        </ul>
      </div>

      <div className="info-box" style={{ borderColor: "#991b1b" }}>
        <h3>What Does NOT Work Here</h3>
        <p>
          The following would cause errors in a Server Component:
        </p>
        <ul>
          <li>
            <code>useState</code>, <code>useEffect</code>, or any React Hook
          </li>
          <li>
            <code>onClick</code>, <code>onSubmit</code>, or any event handlers
          </li>
          <li>
            Browser APIs like <code>localStorage</code>,{" "}
            <code>document.querySelector</code>, etc.
          </li>
        </ul>
        <p style={{ marginTop: "0.5rem" }}>
          Uncomment the button below in the source code to see the build error.
        </p>
      </div>

      <div className="card">
        <h2>Posts (fetched on server)</h2>
        <div className="demo-data">
          {posts.map((post) => (
            <p key={post.id}>
              <strong>#{post.id}</strong> {post.title}
            </p>
          ))}
        </div>
      </div>

      {/* INTERACTIVITY DEMO — Uncomment to see the build error */}
      {/*
        "use client" is NOT present, so this button will NOT work.
        onClick is ignored in Server Components.
        To make this work, move the button to a separate Client Component file.
      */}
      {/*
      <button onClick={() => alert("Clicked!")}>
        This button will not work in a Server Component
      </button>
      */}
    </main>
  );
}
