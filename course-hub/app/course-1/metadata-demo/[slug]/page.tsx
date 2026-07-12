import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title,
    description: `Learn about ${title.toLowerCase()} in Next.js 15. This page demonstrates dynamic metadata generation using the generateMetadata function.`,
    openGraph: {
      title: `${title} - Next.js Course Hub`,
      description: `Learn about ${title.toLowerCase()} in Next.js 15.`,
      type: "article",
    },
  };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;

  const info: Record<string, { summary: string; detail: string }> = {
    "nextjs-seo": {
      summary: "SEO in Next.js",
      detail:
        "Next.js provides built-in support for SEO through its Metadata API. You can define title, description, canonical URLs, and robots directives. The metadata is automatically injected into the <head> element, making it easy for search engines to crawl and index your pages. For dynamic content, use generateMetadata to create page-specific meta tags based on route parameters or fetched data.",
    },
    "opengraph-basics": {
      summary: "OpenGraph Basics",
      detail:
        "Open Graph (OG) meta tags control how your page appears when shared on social platforms like Facebook, Twitter, and LinkedIn. Next.js supports OG tags through the openGraph property in the Metadata object. Key OG properties include og:title, og:description, og:image, and og:type. Proper OG tags improve click-through rates when your content is shared on social media.",
    },
    "dynamic-metadata": {
      summary: "Dynamic Metadata",
      detail:
        "The generateMetadata function receives the same props as the page component (params and searchParams). It runs on every request (or at build time for static generation) and returns a Metadata object. This is ideal for blog posts, product pages, or any content where the metadata depends on the data being displayed. The function can be async, allowing you to fetch data from a database or API to build the metadata.",
    },
  };

  const pageInfo = info[slug] ?? {
    summary: slug.replace(/-/g, " "),
    detail: `This is a dynamically generated page for the slug "${slug}". The metadata for this page was created using generateMetadata, which receives the route params and returns a Metadata object.`,
  };

  return (
    <div>
      <Link
        href="/course-1/metadata-demo"
        style={{ color: "#38bdf8", textDecoration: "none", marginBottom: "1rem", display: "inline-block" }}
      >
        &larr; Back to Metadata Demo
      </Link>

      <h1 className="page-title">{pageInfo.summary}</h1>
      <p className="page-subtitle">
        Slug: <code>{slug}</code> -- generated with dynamic metadata
      </p>

      <div className="card">
        <p style={{ color: "#94a3b8", lineHeight: 1.7 }}>{pageInfo.detail}</p>
      </div>

      <div className="card" style={{ marginTop: "1.5rem" }}>
        <h2>How This Works</h2>
        <pre>
          <code>{`export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.split("-").join(" "),
    description: \`Page about \${slug}\`,
  };
}`}</code>
        </pre>
        <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
          The <code>generateMetadata</code> function above runs for this page. The
          browser tab title and meta tags are set dynamically based on the slug
          in the URL. Check the page source to see the generated OG tags.
        </p>
      </div>
    </div>
  );
}
