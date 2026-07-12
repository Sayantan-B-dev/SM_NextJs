import Link from 'next/link'

const posts = [
  { id: '1', title: 'Getting Started with Next.js 15', excerpt: 'Learn the basics of Next.js 15 and the App Router.' },
  { id: '2', title: 'Understanding Server Components', excerpt: 'Dive into React Server Components and when to use them.' },
  { id: '3', title: 'Caching in Next.js 15', excerpt: 'A comprehensive guide to the caching revamp in Next.js 15.' },
  { id: '4', title: 'Partial Prerendering (PPR) Explained', excerpt: 'How PPR combines static and dynamic rendering for optimal performance.' },
]

export default function BlogPage() {
  return (
    <section>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <article key={post.id}>
          <Link href={`/blog/${post.id}`}>
            <h2>{post.title}</h2>
          </Link>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </section>
  )
}
