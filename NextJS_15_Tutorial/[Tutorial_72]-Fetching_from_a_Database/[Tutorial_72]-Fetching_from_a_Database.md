# Fetching from a Database

## Overview

Fetching data directly from a database in server components eliminates the need for API routes and exposes no sensitive information to the client. This approach leverages two powerful tools: **SQLite** (a file-based database) and **Prisma** (an ORM that translates code into database queries).

## Why Database Access in Server Components?

- **Direct server-side resource access**: Server components run on the server and can interact with databases directly.
- **No API layer required**: Eliminates boilerplate route handlers for data retrieval.
- **Security**: Sensitive database logic never reaches the client bundle.

## Prisma + SQLite Setup

### Step 1: Install Prisma CLI

```bash
npm install prisma --save-dev
```

### Step 2: Initialize Prisma with SQLite

```bash
npx prisma init --datasource-provider sqlite
```

This creates a `prisma/` directory with a `schema.prisma` file.

### Step 3: Configure Database URL

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./app.db"
}
```

### Step 4: Define a Model

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  title       String
  price       Float
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Step 5: Run Migration

```bash
npx prisma migrate dev --name init
```

This command:
1. Creates a migration file in `prisma/migrations/`
2. Executes the migration against the database
3. Installs and generates the Prisma client

### Step 6: Add Database to `.gitignore`

```
*.db
prisma/*.db
```

## Database Client Setup

```typescript
// src/prisma-db.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getProducts() {
  await delay(1500); // simulated latency (remove in production)
  return prisma.product.findMany();
}

export async function getProduct(id: number) {
  await delay(1500);
  return prisma.product.findUnique({ where: { id } });
}

export async function addProduct(data: {
  title: string;
  price: number;
  description?: string;
}) {
  await delay(1500);
  return prisma.product.create({ data });
}

export async function updateProduct(
  id: number,
  data: { title: string; price: number; description?: string }
) {
  await delay(1500);
  return prisma.product.update({ where: { id }, data });
}

export async function deleteProduct(id: number) {
  await delay(1500);
  return prisma.product.delete({ where: { id } });
}

// Helper for simulated latency
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

## Seeding Sample Data

```typescript
export async function seedProducts() {
  const count = await prisma.product.count();
  if (count === 0) {
    await prisma.product.createMany({
      data: [
        { title: "Product One", price: 500, description: "Description one" },
        { title: "Product Two", price: 350, description: "Description two" },
        { title: "Product Three", price: 200, description: "Description three" },
      ],
    });
  }
}
```

## Fetching Data in a Server Component

### Product Type

```typescript
type Product = {
  id: number;
  title: string;
  price: number;
  description: string | null;
};
```

### Page Component

```typescript
// app/products-db/page.tsx
import { getProducts } from "@/prisma-db";

type Product = {
  id: number;
  title: string;
  price: number;
  description: string | null;
};

export default async function ProductsDbPage() {
  const products: Product[] = await getProducts();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <ul className="space-y-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="p-4 border rounded-lg shadow-sm"
          >
            <h2 className="text-xl font-semibold">{product.title}</h2>
            <p className="text-gray-600 mt-1">
              {product.description ?? "No description"}
            </p>
            <p className="text-lg font-bold mt-2">${product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Key Takeaways

| Concept | Description |
|---------|-------------|
| Server Components | Can directly access databases without API routes |
| Prisma Client | Generated ORM client used to query the database |
| SQLite | File-based database, ideal for learning and prototyping |
| `findMany()` | Retrieves all records from a table |
| `findUnique()` | Retrieves a single record by unique identifier |
| Direct import | Database functions are imported and called directly in server components |

## Summary

Fetching data directly from a database in server components is a foundational pattern in Next.js. By combining Prisma with SQLite, you get a straightforward setup for CRUD operations without an API layer. The same concepts apply to any database (PostgreSQL, MySQL, etc.) by changing the Prisma datasource provider. This pattern sets the stage for data mutations and server actions covered in subsequent tutorials.
