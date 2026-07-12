'use client';

import { useState, useEffect } from 'react';

type Post = {
  id: string;
  title: string;
  content: string;
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    const res = await fetch('/api/posts');
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      setTitle('');
      setContent('');
      fetchPosts();
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchPosts();
    }
  }

  return (
    <div>
      <h1>Route Handlers Demo</h1>
      <p>
        This page fetches from <code>/api/posts</code> (GET) on load and allows creating (POST)
        and deleting (DELETE) posts via the API.
      </p>

      <h2>Add a Post</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ marginRight: '0.5rem', padding: '0.5rem' }}
          />
          <input
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{ marginRight: '0.5rem', padding: '0.5rem' }}
          />
          <button type="submit" style={{ padding: '0.5rem 1rem' }}>
            Create Post
          </button>
        </div>
      </form>

      <h2>Posts</h2>
      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p>No posts yet. Create one above!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {posts.map((post) => (
            <li
              key={post.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong>{post.title}</strong>
                <p style={{ margin: '0.25rem 0 0', color: '#555' }}>{post.content}</p>
              </div>
              <button
                onClick={() => handleDelete(post.id)}
                style={{
                  padding: '0.25rem 0.75rem',
                  background: '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
