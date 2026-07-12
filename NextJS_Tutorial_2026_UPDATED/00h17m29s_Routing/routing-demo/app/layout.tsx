import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Routing Demo',
    template: '%s | Routing Demo',
  },
  description: 'A Next.js 15 routing demonstration project',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">Routing Demo</Link>
          <Link href="/about">About</Link>
          <Link href="/blog">Blog</Link>
        </nav>
        <main>{children}</main>
        <footer>
          <p>&copy; 2026 Routing Demo. Built with Next.js 15.</p>
        </footer>
      </body>
    </html>
  )
}
