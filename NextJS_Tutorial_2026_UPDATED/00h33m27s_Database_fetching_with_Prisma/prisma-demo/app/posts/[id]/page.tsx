import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: Props) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
  });

  if (!post) {
    notFound();
  }

  return (
    <div>
      <Link href="/posts">&larr; Back to posts</Link>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>
        <small>
          Post #{post.id} -- created on {post.createdAt.toLocaleDateString()}
        </small>
      </p>
    </div>
  );
}
