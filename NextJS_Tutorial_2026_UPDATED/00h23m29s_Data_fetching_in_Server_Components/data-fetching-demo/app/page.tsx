import { getPosts } from "./lib/api";

export default async function HomePage() {
  // This fetch is cached by default in Next.js 15
  const posts = await getPosts();
  const recentPosts = posts.slice(0, 10);

  return (
    <div>
      <h1>Posts from JSONPlaceholder</h1>
      <p>Data fetched in a Server Component using async/await. No useEffect or useState needed.</p>
      <ul>
        {recentPosts.map(
          (post: { id: number; title: string; body: string }) => (
            <li key={post.id} style={{ marginBottom: 16 }}>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
              <small>Post #{post.id}</small>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
