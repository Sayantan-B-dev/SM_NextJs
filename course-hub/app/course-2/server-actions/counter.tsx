"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ marginTop: "0.75rem" }}>
      <p style={{ marginBottom: "0.5rem", color: "#e2e8f0" }}>Count: {count}</p>
      <button className="btn btn-outline" onClick={() => setCount((c) => c + 1)}>
        Increment
      </button>
      <button
        className="btn btn-outline"
        style={{ marginLeft: "0.5rem" }}
        onClick={() => setCount(0)}
      >
        Reset
      </button>
    </div>
  );
}
