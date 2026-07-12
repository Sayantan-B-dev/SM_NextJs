import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "File Structure Explorer",
  description: "A self-documenting app that explains every file and folder in a Next.js project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
