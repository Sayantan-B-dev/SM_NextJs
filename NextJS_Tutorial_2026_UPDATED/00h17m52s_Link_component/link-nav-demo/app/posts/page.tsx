import Link from "next/link";

export default async function PostsPage() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts: { id: number; title: string }[] = await res.json();
  const recentPosts = posts.slice(0, 20);

  return (
    <div>
      <h1>Posts</h1>
      <p>Each post links to its detail page using a dynamic route.</p>
      <ul>
        {recentPosts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
