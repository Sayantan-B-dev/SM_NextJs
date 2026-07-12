"use client";

import { useState } from "react";

// CLIENT COMPONENT
// The "use client" directive marks this as a client component.
// It runs in the browser and can use React hooks like useState and useEffect.
// This component handles interactivity -- a counter with an onClick button.
export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="card">
      <h2>Client Component (use client)</h2>
      <p style={{ marginBottom: "1rem", color: "#94a3b8" }}>
        This is a <strong>client component</strong> with the <code>"use client"</code>{" "}
        directive. It uses <code>useState</code> for interactivity. Client components
        are hydrated in the browser and respond to user events.
      </p>
      <pre>
        <code>{`"use client";
export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={...}>{count}</button>;
}`}</code>
      </pre>

      <div
        style={{
          textAlign: "center",
          padding: "1.5rem",
          background: "#0f172a",
          borderRadius: "0.5rem",
          border: "1px solid #334155",
        }}
      >
        <p style={{ color: "#94a3b8", marginBottom: "0.75rem" }}>Interactive Counter</p>
        <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#38bdf8", marginBottom: "1rem" }}>
          {count}
        </p>
        <button className="btn" onClick={() => setCount((c) => c + 1)}>
          Increment
        </button>
        <button
          className="btn"
          style={{ marginLeft: "0.5rem", background: "#64748b" }}
          onClick={() => setCount(0)}
        >
          Reset
        </button>
      </div>

      <p style={{ marginTop: "1rem", color: "#f59e0b", fontSize: "0.875rem" }}>
        Note: Only this button and counter are interactive JavaScript. The rest of
        the page (including the fetched posts) is static HTML from the server.
      </p>
    </div>
  );
}
