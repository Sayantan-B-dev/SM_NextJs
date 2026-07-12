import Link from "next/link";

export default function PostNotFound() {
  return (
    <div>
      <h2>Post Not Found</h2>
      <p>The requested post could not be found.</p>
      <Link href="/posts">Back to posts</Link>
    </div>
  );
}
