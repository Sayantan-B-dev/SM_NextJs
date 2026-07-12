import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1>Posts from Database</h1>
      <p>Fetched with Prisma using <code>post.findMany()</code>.</p>
      {posts.length === 0 ? (
        <p>No posts found. Run the seed script to add sample data.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} style={{ marginBottom: 16 }}>
              <Link href={`/posts/${post.id}`}>
                <h2>{post.title}</h2>
              </Link>
              <p>{post.content}</p>
              <small>{post.createdAt.toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
