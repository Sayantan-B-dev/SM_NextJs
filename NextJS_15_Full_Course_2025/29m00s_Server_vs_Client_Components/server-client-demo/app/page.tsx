import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container">
      <h1 className="page-title">Server vs Client Components</h1>
      <p className="page-subtitle">
        An interactive educational demo showing the differences between Server
        and Client Components in Next.js 15 with the App Router.
      </p>

      <div className="home-cards">
        <Link href="/server-demo" className="home-card">
          <h2>Server Component Demo</h2>
          <p>
            See an async Server Component fetching data directly with
            <code> await</code>. No JavaScript shipped to the browser.
            Interactivity (buttons) will not work here.
          </p>
          <span className="badge badge-server">Server Component</span>
        </Link>

        <Link href="/client-demo" className="home-card">
          <h2>Client Component Demo</h2>
          <p>
            Full interactivity with <code>useState</code>, <code>useEffect</code>
            , and event handlers. JavaScript is shipped and hydrated on the
            client.
          </p>
          <span className="badge badge-client">Client Component</span>
        </Link>

        <Link href="/composition" className="home-card">
          <h2>Composition Pattern</h2>
          <p>
            The recommended pattern: a Server Component fetches data, a Client
            Component handles interactivity. Best of both worlds.
          </p>
          <span className="badge badge-composition">Server + Client</span>
        </Link>
      </div>
    </main>
  );
}
