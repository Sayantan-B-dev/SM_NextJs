import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link Nav Demo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav style={{ display: "flex", gap: 16, padding: 16, borderBottom: "1px solid #ccc" }}>
          <Link href="/">Home</Link>
          <Link href="/posts">Posts</Link>
          <Link href="/about" prefetch={false}>About (no prefetch)</Link>
        </nav>
        <main style={{ padding: 24 }}>{children}</main>
      </body>
    </html>
  );
}
