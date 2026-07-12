import Link from "next/link";
import { notFound } from "next/navigation";

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

  const post: { id: number; title: string; body: string } =
    await res.json();

  return (
    <div>
      <Link href="/posts">&larr; Back to posts</Link>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <small>Post #{post.id}</small>
    </div>
  );
}
