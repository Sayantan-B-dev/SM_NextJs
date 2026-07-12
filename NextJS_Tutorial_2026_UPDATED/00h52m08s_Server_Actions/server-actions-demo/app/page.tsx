import { getPosts, createPost, deletePost } from './actions';

function PostForm() {
  return (
    <form
      action={createPost}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: 20,
        border: '1px solid #ddd',
        borderRadius: 8,
        background: '#f9f9f9',
      }}
    >
      <h2>Create a New Post</h2>

      <div>
        <label htmlFor="title" style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: 4,
            fontSize: 16,
          }}
        />
      </div>

      <div>
        <label htmlFor="content" style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
          Content
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={4}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: 4,
            fontSize: 16,
            resize: 'vertical',
          }}
        />
      </div>

      <button
        type="submit"
        style={{
          padding: '10px 20px',
          background: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          fontSize: 16,
          cursor: 'pointer',
          alignSelf: 'flex-start',
        }}
      >
        Create Post
      </button>
    </form>
  );
}

async function PostList() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return <p>No posts yet. Create one above!</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            padding: 16,
            border: '1px solid #eee',
            borderRadius: 8,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <h3 style={{ margin: '0 0 4px 0' }}>{post.title}</h3>
            <p style={{ margin: 0, color: '#555' }}>{post.content}</p>
          </div>

          <form action={deletePost}>
            <input type="hidden" name="id" value={post.id} />
            <button
              type="submit"
              style={{
                padding: '6px 14px',
                background: '#e00',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              Delete
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      <section style={{ marginBottom: 40 }}>
        <PostForm />
      </section>

      <section>
        <h2>Posts</h2>
        <PostList />
      </section>
    </main>
  );
}
