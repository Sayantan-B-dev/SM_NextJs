import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Routes & Navigation App",
  description: "A multi-page Next.js application demonstrating file-based routing and navigation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav>
          <span className="brand">MyApp</span>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <main>{children}</main>
        <footer>
          <p>&copy; 2025 Routes & Navigation App. Built with Next.js 15.</p>
        </footer>
      </body>
    </html>
  );
}
