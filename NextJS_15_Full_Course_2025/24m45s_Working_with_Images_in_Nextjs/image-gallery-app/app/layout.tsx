import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Image Gallery — Next.js Image Component Demo",
  description:
    "Demonstrating next/image with remote images, priority loading, lazy loading, and the fill prop.",
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
            Image Gallery
          </Link>
          <div className="nav-links">
            <Link href="/">Gallery</Link>
          </div>
        </nav>
        {children}
        <footer>
          Built with Next.js Image Component &mdash; Remote Images Demo
        </footer>
      </body>
    </html>
  );
}
