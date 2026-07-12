"use client";

import { useState, useEffect } from "react";

interface Post {
  id: number;
  title: string;
  content: string;
}

export default function RouteHandlersPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchPosts() {
    setLoading(true);
    const res = await fetch("/course-2/route-handlers/api/posts");
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/course-2/route-handlers/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      setTitle("");
      setContent("");
      fetchPosts();
    }
  }

  async function handleDelete(id: number) {
    await fetch(`/course-2/route-handlers/api/posts/${id}`, {
      method: "DELETE",
    });
    fetchPosts();
  }

  return (
    <div>
      <h1 className="page-title">Route Handlers</h1>
      <p className="page-subtitle">
        CRUD interface using Next.js API route handlers.
      </p>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3>Create Post</h3>
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              background: "#0f172a",
              border: "1px solid #334155",
              color: "#e2e8f0",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              width: "100%",
              marginBottom: "0.75rem",
            }}
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{
              background: "#0f172a",
              border: "1px solid #334155",
              color: "#e2e8f0",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              width: "100%",
              marginBottom: "0.75rem",
              minHeight: "80px",
              fontFamily: "inherit",
            }}
          />
          <button type="submit" className="btn">
            Create Post
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Posts</h3>
        {loading ? (
          <p>Loading...</p>
        ) : posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <ul style={{ listStyle: "none", marginTop: "0.75rem" }}>
            {posts.map((post) => (
              <li
                key={post.id}
                style={{
                  padding: "0.75rem 0",
                  borderBottom: "1px solid #334155",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong style={{ color: "#e2e8f0" }}>{post.title}</strong>
                  <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                    {post.content}
                  </p>
                </div>
                <button
                  className="btn btn-outline"
                  style={{ fontSize: "0.75rem" }}
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
