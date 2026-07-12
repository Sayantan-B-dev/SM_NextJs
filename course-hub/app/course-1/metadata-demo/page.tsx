import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metadata & SEO",
  description:
    "Learn how to use static and dynamic metadata in Next.js 15 for better SEO and social sharing.",
  keywords: ["nextjs", "metadata", "seo", "opengraph"],
  openGraph: {
    title: "Metadata & SEO - Next.js Course Hub",
    description:
      "Learn how to use static and dynamic metadata in Next.js 15 for better SEO and social sharing.",
    type: "website",
  },
};

export default function MetadataDemo() {
  const slugs = ["nextjs-seo", "opengraph-basics", "dynamic-metadata"];

  return (
    <div>
      <h1 className="page-title">Metadata & SEO</h1>
      <p className="page-subtitle">
        Next.js 15 provides a powerful Metadata API for controlling page title,
        description, Open Graph tags, and more -- both statically and dynamically.
      </p>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2>Static Metadata</h2>
        <p style={{ marginBottom: "1rem", color: "#94a3b8" }}>
          Export a <code>metadata</code> object (or <code>generateMetadata</code>{" "}
          function) from any layout or page file. Next.js automatically injects the
          corresponding <code>&lt;meta&gt;</code> tags into the <code>&lt;head&gt;</code>.
        </p>
        <pre>
          <code>{`import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metadata & SEO",
  description: "Learn how to use metadata in Next.js 15...",
  keywords: ["nextjs", "metadata", "seo"],
  openGraph: {
    title: "Metadata & SEO - Next.js Course Hub",
    description: "...",
    type: "website",
  },
};`}</code>
        </pre>
        <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
          Check the browser tab title and view the page source to see the generated
          meta tags from the static export above.
        </p>
      </div>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2>Dynamic Metadata with generateMetadata</h2>
        <p style={{ marginBottom: "1rem", color: "#94a3b8" }}>
          For dynamic routes, use the <code>generateMetadata</code> async function.
          It receives the route params and returns a Metadata object. The page metadata
          is generated at request time based on the slug.
        </p>
        <pre>
          <code>{`export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, " "),
    description: \`Page about \${slug}\`,
  };
}`}</code>
        </pre>
      </div>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2>Try Dynamic Pages</h2>
        <p style={{ marginBottom: "1rem", color: "#94a3b8" }}>
          Click a link below to visit a dynamic sub-page. Each page has dynamically
          generated metadata based on its slug.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {slugs.map((slug) => (
            <Link
              key={slug}
              href={`/course-1/metadata-demo/${slug}`}
              className="btn btn-outline"
            >
              /{slug}
            </Link>
          ))}
        </div>
      </div>

      <Link href="/course-1" className="btn" style={{ display: "inline-block" }}>
        Back to Course 1
      </Link>
    </div>
  );
}
