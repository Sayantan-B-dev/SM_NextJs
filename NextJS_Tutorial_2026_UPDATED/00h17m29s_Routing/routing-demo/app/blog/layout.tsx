import Link from 'next/link'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <nav style={{
        background: 'transparent',
        padding: '0 0 1rem 0',
        borderBottom: '2px solid #e0e0e0',
        marginBottom: '1.5rem',
      }}>
        <Link href="/blog" style={{ color: '#1a1a2e', marginRight: '1rem' }}>
          &larr; Blog Home
        </Link>
      </nav>
      {children}
    </section>
  )
}
