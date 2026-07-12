import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div style={{ textAlign: "center", padding: "3rem 0" }}>
        <h1 className="page-title">Next.js Course Hub</h1>
        <p className="page-subtitle">
          A comprehensive demo application demonstrating concepts from three Next.js courses.
          Each section showcases practical implementations of the topics covered.
        </p>
      </div>

      <div className="grid-3">
        <div className="card">
          <h2>Course 1: Foundations</h2>
          <p style={{ marginBottom: "1rem" }}>
            Routing, navigation, image optimization, server/client components, dynamic routes,
            API routes, metadata and SEO.
          </p>
          <Link href="/course-1" className="btn">Explore Course 1</Link>
        </div>

        <div className="card">
          <h2>Course 2: Advanced</h2>
          <p style={{ marginBottom: "1rem" }}>
            Middleware & proxy, server actions, caching strategies, route handlers,
            Prisma integration, PPR, deployment.
          </p>
          <Link href="/course-2" className="btn">Explore Course 2</Link>
        </div>

        <div className="card">
          <h2>Course 3: Production</h2>
          <p style={{ marginBottom: "1rem" }}>
            Data fetching patterns, error handling, parallel routes, intercepting routes,
            server action forms, authentication, RBAC.
          </p>
          <Link href="/course-3" className="btn">Explore Course 3</Link>
        </div>
      </div>
    </div>
  );
}