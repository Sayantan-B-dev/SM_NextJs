import Link from "next/link";

export default function Course1Home() {
  return (
    <div>
      <h1 className="page-title">Course 1: Next.js Foundations</h1>
      <p className="page-subtitle">
        Based on the NextJS 15 Full Course 2025 -- covering setup, routing, images,
        server/client components, dynamic routes, API routes, and metadata.
      </p>

      <div className="grid-2">
        <Link href="/course-1/components-demo" className="card" style={{ textDecoration: "none" }}>
          <h2>Server vs Client Components</h2>
          <p>Interactive demo showing the difference between server and client components, async data fetching, and the composition pattern.</p>
        </Link>
        <Link href="/course-1/images-demo" className="card" style={{ textDecoration: "none" }}>
          <h2>Image Optimization</h2>
          <p>Using next/image with local and remote images, priority loading, and responsive sizes.</p>
        </Link>
        <Link href="/course-1/api-basics/demo" className="card" style={{ textDecoration: "none" }}>
          <h2>API Routes Basics</h2>
          <p>Creating route handlers with GET and POST methods, request/response patterns.</p>
        </Link>
        <Link href="/course-1/metadata-demo" className="card" style={{ textDecoration: "none" }}>
          <h2>Metadata & SEO</h2>
          <p>Static and dynamic metadata, open graph, generateMetadata for dynamic pages.</p>
        </Link>
      </div>
    </div>
  );
}