"use client";

import Link from "next/link";
import { useEffect, useState, FormEvent } from "react";

interface Item {
  id: number;
  name: string;
  description: string;
}

export default function ApiBasicsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [posting, setPosting] = useState(false);
  const [responseMsg, setResponseMsg] = useState<string | null>(null);

  async function fetchItems() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/course-1/api-basics");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    setPosting(true);
    setResponseMsg(null);
    try {
      const res = await fetch("/course-1/api-basics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResponseMsg(`Error: ${data.error}`);
      } else {
        setResponseMsg(`Created item: ${data.name} (id: ${data.id})`);
        setName("");
        setDescription("");
        fetchItems();
      }
    } catch (err) {
      setResponseMsg(err instanceof Error ? err.message : "Network error");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div>
      <h1 className="page-title">API Routes Basics</h1>
      <p className="page-subtitle">
        Route handlers in Next.js 15 allow you to create API endpoints within your
        app directory using route.ts files.
      </p>

      <div className="grid-2">
        {/* LIST ITEMS */}
        <div className="card">
          <h2>GET /course-1/api-basics</h2>
          <p style={{ marginBottom: "1rem", color: "#94a3b8" }}>
            Fetching items from the route handler on page load via useEffect.
          </p>

          {loading ? (
            <p style={{ color: "#64748b" }}>Loading...</p>
          ) : error ? (
            <p style={{ color: "#f87171" }}>{error}</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {items.map((item) => (
                <li
                  key={item.id}
                  style={{
                    padding: "0.75rem",
                    marginBottom: "0.5rem",
                    background: "#0f172a",
                    borderRadius: "0.375rem",
                    border: "1px solid #334155",
                  }}
                >
                  <strong style={{ color: "#a78bfa" }}>{item.name}</strong>
                  <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                    {item.description}
                  </p>
                  <small style={{ color: "#475569" }}>ID: {item.id}</small>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* FORM TO POST */}
        <div className="card">
          <h2>POST /course-1/api-basics</h2>
          <p style={{ marginBottom: "1rem", color: "#94a3b8" }}>
            Send a new item via POST. The route handler validates the input and
            returns the created item with a 201 status.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "0.75rem" }}>
              <label
                htmlFor="name"
                style={{ display: "block", marginBottom: "0.25rem", color: "#94a3b8", fontSize: "0.875rem" }}
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #334155",
                  background: "#0f172a",
                  color: "#e2e8f0",
                }}
                required
              />
            </div>
            <div style={{ marginBottom: "0.75rem" }}>
              <label
                htmlFor="desc"
                style={{ display: "block", marginBottom: "0.25rem", color: "#94a3b8", fontSize: "0.875rem" }}
              >
                Description
              </label>
              <input
                id="desc"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #334155",
                  background: "#0f172a",
                  color: "#e2e8f0",
                }}
                required
              />
            </div>
            <button type="submit" className="btn" disabled={posting}>
              {posting ? "Posting..." : "Create Item"}
            </button>
          </form>

          {responseMsg && (
            <p
              style={{
                marginTop: "0.75rem",
                padding: "0.5rem",
                borderRadius: "0.375rem",
                background: "#0f172a",
                border: "1px solid #334155",
                color: responseMsg.startsWith("Error") ? "#f87171" : "#4ade80",
                fontSize: "0.875rem",
              }}
            >
              {responseMsg}
            </p>
          )}
        </div>
      </div>

      <Link href="/course-1" className="btn" style={{ marginTop: "1.5rem", display: "inline-block" }}>
        Back to Course 1
      </Link>
    </div>
  );
}
