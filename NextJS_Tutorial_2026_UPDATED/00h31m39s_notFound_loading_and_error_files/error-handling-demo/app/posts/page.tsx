import Link from "next/link";

export default async function PostsPage() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!res.ok) throw new Error("Failed to fetch posts");
  const posts: { id: number; title: string }[] = await res.json();
  const recentPosts = posts.slice(0, 20);

  return (
    <div>
      <h1>Posts</h1>
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
