# Database Fetching with Prisma in Next.js

Prisma is a modern ORM (Object-Relational Mapper) for Node.js and TypeScript. It provides type-safe database access, auto-generated queries, and a declarative schema language. This guide covers integrating Prisma with Next.js 15 Server Components.

## Prisma Overview

Prisma consists of three main tools:

| Tool | Purpose |
|---|---|
| **Prisma Schema** | Declarative data model definition in `schema.prisma` |
| **Prisma Client** | Auto-generated type-safe query builder (`@prisma/client`) |
| **Prisma Migrate** | Database migration tool (maps schema to database) |

## Setup: `prisma init`

Install Prisma and initialize it in your project:

```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

This creates:
- `prisma/schema.prisma` -- your data model
- `.env` -- environment variables (database URL)

## Schema Definition

Define models in `prisma/schema.prisma`. Here is a `Post` model:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  createdAt DateTime @default(now())
}
```

This guide uses SQLite for simplicity (no external database server required). The same schema works with PostgreSQL, MySQL, MongoDB, and other providers by changing the `provider` and `url`.

## Environment Variables

Add your database URL to `.env`:

```env
# SQLite
DATABASE_URL="file:./dev.db"

# For PostgreSQL:
# DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# For MongoDB:
# DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/mydb"
```

## PrismaClient Singleton Pattern

In Next.js, always use a singleton pattern for PrismaClient to avoid creating multiple connections during development (hot reloading):

```ts
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

This prevents exhausting database connections during development.

## Using Prisma in Server Components

### `findMany` -- List All Records

```ts
// app/posts/page.tsx
import { prisma } from "@/lib/prisma";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <small>{post.createdAt.toLocaleDateString()}</small>
        </li>
      ))}
    </ul>
  );
}
```

### `findUnique` -- Single Record

```ts
// app/posts/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
  });

  if (!post) {
    notFound();
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <time>{post.createdAt.toLocaleDateString()}</time>
    </article>
  );
}
```

### `notFound()` Guard

Always guard against missing records with `notFound()`:

```ts
const post = await prisma.post.findUnique({
  where: { id: parseInt(id) },
});

if (!post) {
  notFound();
}
```

## Running Migrations

After defining your schema, create the database and apply migrations:

```bash
npx prisma migrate dev --name init
```

This creates the SQLite database file and generates the Prisma Client code.

## Seeding Data

Create a seed script to add sample data:

```ts
// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.post.createMany({
    data: [
      { title: "First Post", content: "This is the first post." },
      { title: "Second Post", content: "This is the second post." },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Add to `package.json`:

```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

Then run:

```bash
npx prisma db seed
```

## Same Concept for MongoDB and SQL

The Prisma schema pattern remains the same regardless of the database provider. Change only the `datasource` block:

```prisma
// For MongoDB (using Prisma MongoDB connector):
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model Post {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  title     String
  content   String
  createdAt DateTime @default(now())
}
```

```prisma
// For PostgreSQL:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

The Prisma Client API (`findMany`, `findUnique`, `create`, `update`, `delete`) remains identical across database providers.

## Best Practices

1. **Use the singleton pattern** for PrismaClient to avoid connection exhaustion.
2. **Always call `notFound()`** when `findUnique` returns null.
3. **Use environment variables** for database URLs -- never hardcode credentials.
4. **Run `prisma generate`** after schema changes to update the client.
5. **Use `prisma migrate dev`** during development and `prisma migrate deploy` in production.
6. **Type your Prisma models** -- the generated client provides full TypeScript types.
7. **Consider pagination** with `skip` and `take` for large datasets instead of loading everything.
