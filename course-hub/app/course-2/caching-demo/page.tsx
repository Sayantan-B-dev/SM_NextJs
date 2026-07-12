import RefreshButton from "./refresh-button";

export default async function CachingDemoPage() {
  const timestamp = new Date().toISOString();

  const cachedRes = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=3",
    { cache: "force-cache" }
  );
  const cachedPosts = await cachedRes.json();

  const freshRes = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=3",
    { cache: "no-store" }
  );
  const freshPosts = await freshRes.json();

  return (
    <div>
      <h1 className="page-title">Caching Strategies</h1>
      <p className="page-subtitle">
        Next.js provides different cache strategies to balance performance and freshness.
      </p>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3>Page Render Timestamp</h3>
        <p>
          This timestamp shows when the page was rendered on the server:{" "}
          <code>{timestamp}</code>
        </p>
      </div>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3>force-cache (Default)</h3>
        <p>
          This data is cached until revalidated. The result will be the same on subsequent
          visits, even if the underlying data changes.
        </p>
        <pre>{JSON.stringify(cachedPosts, null, 2)}</pre>
      </div>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3>no-store (Fresh Data)</h3>
        <p>
          This data is fetched on every request and never cached. Each page load will
          show fresh data.
        </p>
        <pre>{JSON.stringify(freshPosts, null, 2)}</pre>
      </div>

      <div className="card">
        <h3>Re-fetch</h3>
        <p>
          Click the button below to trigger a router refresh, which will re-render the
          server component and fetch fresh data for no-store requests.
        </p>
        <div style={{ marginTop: "0.75rem" }}>
          <RefreshButton />
        </div>
      </div>
    </div>
  );
}
