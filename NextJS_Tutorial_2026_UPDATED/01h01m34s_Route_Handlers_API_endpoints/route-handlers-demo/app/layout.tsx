import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Route Handlers Demo',
  description: 'Demo of Next.js Route Handlers (API endpoints)',
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
