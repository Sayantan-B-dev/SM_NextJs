import { db } from "@/lib/db";

export default async function PrismaDemoPage() {
  const posts = await db.post.findMany();
  const firstPost = await db.post.findUnique({ where: { id: 1 } });

  return (
    <div>
      <h1 className="page-title">Prisma & Database</h1>
      <p className="page-subtitle">
        This demo uses a mock database that mimics the Prisma API. The same patterns
        work with a real database.
      </p>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3>findMany - All Posts</h3>
        <p>Retrieves all records from the post table.</p>
        <pre>{JSON.stringify(posts, null, 2)}</pre>
      </div>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3>findUnique - Post with id 1</h3>
        <p>Retrieves a single record by unique identifier.</p>
        <pre>{JSON.stringify(firstPost, null, 2)}</pre>
      </div>

      <div className="card">
        <h3>Swap with Real Prisma</h3>
        <p>
          Replace the mock in <code>lib/db.ts</code> with the Prisma client. First install
          Prisma and set up your schema, then swap the export:
        </p>
        <pre>{`import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const db = prisma;`}</pre>
        <p style={{ marginTop: "0.5rem", color: "#94a3b8" }}>
          The rest of your code using <code>db.post.findMany()</code> and{" "}
          <code>db.post.findUnique()</code> will work without changes.
        </p>
      </div>
    </div>
  );
}
