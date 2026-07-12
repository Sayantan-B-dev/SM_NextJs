import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Dynamic Routes & Search Params Demo</h1>
      <ul>
        <li><Link href="/posts">Posts list with search filter</Link></li>
        <li><Link href="/posts/1">Single post via dynamic route</Link></li>
        <li><Link href="/posts?search=qui">Filter posts with ?search=qui</Link></li>
      </ul>
    </div>
  );
}
