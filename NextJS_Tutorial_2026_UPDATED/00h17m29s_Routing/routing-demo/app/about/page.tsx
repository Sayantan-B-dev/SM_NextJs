import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
}

export default function AboutPage() {
  return (
    <section>
      <h1>About This Demo</h1>
      <p>
        This is a Next.js 15 routing demonstration. It showcases the App Router
        with static routes, dynamic routes, nested layouts, and more.
      </p>
      <h2>Key Concepts Shown</h2>
      <ul>
        <li>File-based routing with <code>page.tsx</code></li>
        <li>Dynamic routes with <code>[slug]</code></li>
        <li>Nested layouts (<code>blog/layout.tsx</code>)</li>
        <li>Root layout with shared navigation</li>
        <li>Metadata API for SEO</li>
      </ul>
    </section>
  )
}
