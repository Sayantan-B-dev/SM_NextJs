import Link from 'next/link'

const posts = [
  { slug: 'getting-started', title: 'Getting Started with Next.js 15' },
  { slug: 'server-components', title: 'Understanding Server Components' },
  { slug: 'caching-revamp', title: 'Caching in Next.js 15' },
  { slug: 'partial-prerendering', title: 'Partial Prerendering (PPR) Explained' },
]

export default function BlogPage() {
  return (
    <section>
      <h1>Blog</h1>
      <p>Click a post to see the dynamic route in action:</p>
      {posts.map(post => (
        <article key={post.slug}>
          <Link href={`/blog/${post.slug}`}>
            <h2>{post.title}</h2>
          </Link>
          <p>Slug: <code>{post.slug}</code></p>
        </article>
      ))}
    </section>
  )
}
