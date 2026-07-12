import Link from 'next/link'

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <section>
      <h1>Blog Post: {slug}</h1>
      <div className="slug-display">
        <p>
          You are viewing the blog post with slug: <strong>{slug}</strong>
        </p>
        <p>
          This page was rendered using a dynamic route with the pattern
          <code> app/blog/[slug]/page.tsx</code>.
        </p>
      </div>
      <p>
        In Next.js 15, the <code>params</code> prop is a Promise that must be
        awaited before accessing its properties.
      </p>
      <Link href="/blog">&larr; Back to Blog</Link>
    </section>
  )
}
