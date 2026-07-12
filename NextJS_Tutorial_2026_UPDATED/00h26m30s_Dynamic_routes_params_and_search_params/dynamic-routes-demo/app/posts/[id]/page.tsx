import Link from "next/link";
import { notFound } from "next/navigation";

// params is a Promise in Next.js 15
type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: Props) {
  const { id } = await params;

  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );

  if (!res.ok) {
    notFound();
  }

  const post: { id: number; title: string; body: string; userId: number } =
    await res.json();

  return (
    <div>
      <Link href="/posts">&larr; Back to posts</Link>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <p>
        <small>Post #{post.id} by user #{post.userId}</small>
      </p>
    </div>
  );
}
