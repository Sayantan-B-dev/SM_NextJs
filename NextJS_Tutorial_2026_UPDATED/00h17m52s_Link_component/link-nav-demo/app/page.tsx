import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the Link component demo. Use the navigation above to explore.</p>
      <p>
        The <strong>About</strong> link uses <code>prefetch={false}</code> --
        open DevTools Network tab and hover over it to see no prefetch request.
      </p>
      <ul>
        <li><Link href="/posts">View all posts</Link></li>
        <li><Link href="/posts/1">View post #1</Link></li>
        <li><Link href="/posts/2">View post #2</Link></li>
        <li><Link href="/posts/3">View post #3</Link></li>
      </ul>
    </div>
  );
}
