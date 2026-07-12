import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Error Handling Demo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", maxWidth: 900, margin: "0 auto", padding: 24 }}>
        <nav style={{ display: "flex", gap: 16, padding: "0 0 16px", borderBottom: "1px solid #ccc", marginBottom: 24 }}>
          <Link href="/">Home</Link>
          <Link href="/posts">Posts</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
