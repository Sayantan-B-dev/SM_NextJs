import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Components Demo',
  description: 'Demo of Next.js Client Components and composition patterns',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: '2rem' }}>
        {children}
      </body>
    </html>
  );
}
