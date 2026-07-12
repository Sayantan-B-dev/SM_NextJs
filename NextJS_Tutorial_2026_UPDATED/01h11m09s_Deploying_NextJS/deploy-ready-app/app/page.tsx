export default function HomePage() {
  return (
    <div>
      <h1>Deploy-Ready Next.js App</h1>
      <p>
        This app is configured for deployment using <code>output: &apos;standalone&apos;</code>.
        Build it, then deploy using the included Dockerfile or any Node.js host.
      </p>
      <p>
        Environment variables used by this app:
      </p>
      <ul>
        <li><code>NEXT_PUBLIC_SITE_URL</code> - The public URL of the deployed site</li>
        <li><code>DATABASE_URL</code> - Connection string for the database</li>
      </ul>
      <p>
        See <code>.env.example</code> for all required environment variables.
      </p>
      <h2>Build Commands</h2>
      <pre style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
{`npm run build
npm run start

# Or with Docker:
docker build -t my-app .
docker run -p 3000:3000 my-app`}
      </pre>
    </div>
  );
}
