import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about this Next.js 15 demonstration application",
};

export default function AboutPage() {
  return (
    <div>
      <h1>About This Application</h1>

      <div className="card">
        <h2>Purpose</h2>
        <p>
          This application serves as a comprehensive demonstration of Next.js 15
          features, combining everything learned about API routes, metadata and
          SEO, layout composition, dynamic routing, loading states, error
          handling, and the interplay between server and client components.
        </p>
      </div>

      <div className="card">
        <h2>Technologies</h2>
        <ul>
          <li>
            <strong>Next.js 15</strong> -- React framework with App Router
          </li>
          <li>
            <strong>TypeScript</strong> -- Type-safe development
          </li>
          <li>
            <strong>In-Memory Data Store</strong> -- API routes manage an
            in-memory array as a mock database
          </li>
          <li>
            <strong>JSONPlaceholder</strong> -- External API for user data
            demonstration
          </li>
        </ul>
      </div>

      <div className="card">
        <h2>Key Concepts Demonstrated</h2>
        <table>
          <thead>
            <tr>
              <th>Concept</th>
              <th>Implementation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Route Handlers</td>
              <td>app/api/users/route.ts with GET, POST</td>
            </tr>
            <tr>
              <td>Dynamic API Routes</td>
              <td>app/api/users/[id]/route.ts with GET, DELETE</td>
            </tr>
            <tr>
              <td>Static Metadata</td>
              <td>Root layout and about page metadata exports</td>
            </tr>
            <tr>
              <td>Dynamic Metadata</td>
              <td>generateMetadata in user profile page</td>
            </tr>
            <tr>
              <td>Server Component</td>
              <td>Users list and user profile pages</td>
            </tr>
            <tr>
              <td>Client Component</td>
              <td>Client demo page with API interactions</td>
            </tr>
            <tr>
              <td>Layout Composition</td>
              <td>Root layout with nested navigation</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
