// This is a SERVER COMPONENT — it fetches data on the server
// It composes a Client Component (LikeButton) inside the rendered output.
// This is the recommended "composition pattern":
//   Server Component fetches data  +  Client Component handles interactivity

import LikeButton from "./like-button";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export default async function CompositionPage() {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=6"
  );
  const posts: Post[] = await res.json();

  return (
    <main className="container">
      <h1 className="page-title">Composition Pattern</h1>
      <p className="page-subtitle">
        The recommended approach: a Server Component fetches data (fast, no JS
        overhead), and a Client Component handles interactivity like buttons and
        state.
      </p>

      <div className="info-box">
        <h3>How This Works</h3>
        <ul>
          <li>
            <strong>Server Component</strong> (<code>page.tsx</code>): Fetches
            posts with direct <code>await fetch()</code>. No JavaScript shipped.
          </li>
          <li>
            <strong>Client Component</strong> (<code>like-button.tsx</code>):
            Handles the &quot;Like&quot; button with <code>useState</code> and
            <code> onClick</code>. Only the button JavaScript is shipped.
          </li>
          <li>
            The Server Component passes data as props; the Client Component only
            handles interaction.
          </li>
        </ul>
      </div>

      <div className="card">
        <h2>Posts (fetched by Server Component)</h2>
        <div className="demo-data">
          {posts.map((post) => (
            <p key={post.id}>
              <strong>#{post.id}</strong> {post.title}
              <span style={{ marginLeft: "0.75rem" }}>
                <LikeButton />
              </span>
            </p>
          ))}
        </div>
      </div>

      <div className="info-box" style={{ borderColor: "#8b5cf6" }}>
        <h3>Why This Pattern Wins</h3>
        <ul>
          <li>
            Data fetching happens on the server — faster, no client waterfall.
          </li>
          <li>
            Only the interactive parts ship JavaScript to the browser.
          </li>
          <li>
            The page content is fully rendered HTML — great for SEO.
          </li>
          <li>
            The buttons are fully interactive after hydration.
          </li>
        </ul>
      </div>
    </main>
  );
}
