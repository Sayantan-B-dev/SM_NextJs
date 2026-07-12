import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
}

export default function AboutPage() {
  return (
    <section>
      <h1>About This Blog</h1>
      <p>
        This blog was created as part of a Next.js 15 tutorial. It demonstrates
        routing, layouts, and basic page structure using the App Router.
      </p>
      <h2>Technologies Used</h2>
      <ul>
        <li>Next.js 15</li>
        <li>TypeScript</li>
        <li>Global CSS</li>
      </ul>
    </section>
  )
}
