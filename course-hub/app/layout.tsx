import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Next.js Course Hub",
    template: "%s | Next.js Course Hub",
  },
  description: "A comprehensive demo application covering three Next.js courses",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="nav-inner">
            <Link href="/" className="nav-brand">Course Hub</Link>
            <div className="nav-links">
              <Link href="/course-1">Course 1</Link>
              <Link href="/course-2">Course 2</Link>
              <Link href="/course-3">Course 3</Link>
            </div>
          </div>
        </nav>
        <main className="main">{children}</main>
        <footer className="footer">
          <p>Next.js Course Hub -- Demonstrating concepts from all three courses</p>
        </footer>
      </body>
    </html>
  );
}