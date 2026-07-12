import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Prisma + Next.js Demo</h1>
      <p>
        This project uses Prisma with SQLite to fetch posts from a local database.
        Before running, set up the database:
      </p>
      <pre style={{ background: "#f5f5f5", padding: 16, borderRadius: 8 }}>
        {`npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed`}
      </pre>
      <ul>
        <li><Link href="/posts">View posts from database</Link></li>
      </ul>
    </div>
  );
}
