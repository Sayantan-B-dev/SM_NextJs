import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Server vs Client Components — Next.js Demo",
  description:
    "An educational demo showcasing the differences between Server and Client Components in Next.js 15.",
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
          <Link href="/" className="logo">
            Server vs Client
          </Link>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/server-demo">Server Demo</Link>
            <Link href="/client-demo">Client Demo</Link>
            <Link href="/composition">Composition</Link>
          </div>
        </nav>
        {children}
        <footer>
          Next.js 15 — Server vs Client Components Educational Demo
        </footer>
      </body>
    </html>
  );
}
