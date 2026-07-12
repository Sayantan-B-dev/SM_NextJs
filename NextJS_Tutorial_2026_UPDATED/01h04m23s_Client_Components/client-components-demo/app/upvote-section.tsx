'use client';

import { useState } from 'react';
import { upvotePost } from './actions';
import { Counter } from './counter';

type Post = {
  id: string;
  title: string;
  votes: number;
};

type Props = {
  posts: Post[];
};

// Client Component: handles state and interactivity.
// It receives data as props from the parent Server Component.
export function UpvoteSection({ posts }: Props) {
  const [localPosts, setLocalPosts] = useState<Post[]>(posts);

  async function handleUpvote(postId: string) {
    // Optimistic update
    setLocalPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, votes: p.votes + 1 } : p
      )
    );
    await upvotePost(postId);
  }

  return (
    <div>
      {localPosts.map((post) => (
        <div
          key={post.id}
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>{post.title}</h3>
            <Counter count={post.votes} />
          </div>
          <button
            onClick={() => handleUpvote(post.id)}
            style={{
              marginTop: '0.5rem',
              padding: '0.4rem 1rem',
              background: '#3498db',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Upvote
          </button>
        </div>
      ))}
    </div>
  );
}
