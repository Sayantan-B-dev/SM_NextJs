import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'My Blog',
    template: '%s | My Blog',
  },
  description: 'A simple blog built with Next.js 15',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">My Blog</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/about">About</Link>
        </nav>
        <main>{children}</main>
        <footer>
          <p>&copy; 2026 My Blog. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}
