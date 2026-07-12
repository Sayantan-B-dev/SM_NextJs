import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Full Next.js 15 Application</h1>
      <p>
        This application demonstrates the complete set of Next.js 15 features
        including API routes, metadata and SEO optimization, layout composition,
        dynamic routing, and client-server component interaction.
      </p>

      <div className="card">
        <h2>Application Sections</h2>
        <table>
          <thead>
            <tr>
              <th>Route</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Link href="/about">/about</Link>
              </td>
              <td>
                <span className="badge server">Server</span>
              </td>
              <td>Static page with dedicated metadata</td>
            </tr>
            <tr>
              <td>
                <Link href="/users">/users</Link>
              </td>
              <td>
                <span className="badge server">Server</span>
              </td>
              <td>Fetches and displays all users</td>
            </tr>
            <tr>
              <td>
                <Link href="/users/1">/users/[userId]</Link>
              </td>
              <td>
                <span className="badge server">Server</span>
              </td>
              <td>Dynamic user page with dynamic metadata</td>
            </tr>
            <tr>
              <td>
                <Link href="/client-demo">/client-demo</Link>
              </td>
              <td>
                <span className="badge client">Client</span>
              </td>
              <td>Interactive client component consuming API routes</td>
            </tr>
            <tr>
              <td>
                <code>/api/users</code>
              </td>
              <td>
                <span className="badge api">API</span>
              </td>
              <td>GET all users, POST new user</td>
            </tr>
            <tr>
              <td>
                <code>/api/users/[id]</code>
              </td>
              <td>
                <span className="badge api">API</span>
              </td>
              <td>GET user by ID, DELETE user</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
