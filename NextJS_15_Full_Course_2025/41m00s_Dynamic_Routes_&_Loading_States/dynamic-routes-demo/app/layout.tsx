import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dynamic Routes Demo",
  description: "A demonstration of dynamic routes, loading states, and error handling in Next.js 15",
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
          <Link href="/">Home</Link>
          <Link href="/users">Users</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
