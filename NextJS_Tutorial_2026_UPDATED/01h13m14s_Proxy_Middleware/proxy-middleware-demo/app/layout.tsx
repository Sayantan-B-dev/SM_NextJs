import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Middleware Demo',
  description: 'Demo of Next.js Middleware (proxy.ts)',
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
