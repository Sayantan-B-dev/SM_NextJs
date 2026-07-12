import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Full Next.js App",
    template: "%s | Full Next.js App",
  },
  description:
    "A comprehensive Next.js 15 demo covering API routes, metadata, SEO, layouts, and client-server component interaction",
  keywords: [
    "nextjs",
    "react",
    "api-routes",
    "metadata",
    "seo",
    "typescript",
  ],
  openGraph: {
    title: "Full Next.js App",
    description:
      "A comprehensive Next.js 15 demo covering API routes, metadata, SEO, layouts, and client-server interaction",
    type: "website",
  },
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
          <span>Next.js 15 Demo</span>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/users">Users</Link>
          <Link href="/client-demo">Client API Demo</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
