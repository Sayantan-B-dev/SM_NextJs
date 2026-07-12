export const metadata = {
  title: 'Server Actions Demo',
  description: 'A demo of Next.js 15 Server Actions with CRUD operations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 720, margin: '0 auto', padding: 24 }}>
        <header style={{ marginBottom: 32 }}>
          <h1>Server Actions Demo</h1>
          <p>A practical demonstration of Next.js 15 Server Actions for CRUD operations.</p>
          <hr />
        </header>
        {children}
      </body>
    </html>
  );
}
