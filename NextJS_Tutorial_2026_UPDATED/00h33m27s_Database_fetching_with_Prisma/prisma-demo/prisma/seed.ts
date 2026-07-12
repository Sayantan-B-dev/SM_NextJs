import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.post.createMany({
    data: [
      { title: "Getting Started with Next.js", content: "Next.js is a React framework for building full-stack web applications. It provides server-side rendering, static site generation, and API routes out of the box." },
      { title: "Understanding Server Components", content: "React Server Components allow you to render components on the server, reducing the JavaScript sent to the client and improving performance." },
      { title: "Introduction to Prisma ORM", content: "Prisma is a next-generation ORM that provides type-safe database access, auto-generated queries, and a declarative schema language." },
      { title: "Data Fetching Patterns", content: "Next.js supports multiple data fetching strategies including server-side fetch, static generation, and incremental static regeneration." },
      { title: "Building RESTful APIs", content: "Next.js Route Handlers allow you to create full REST APIs within your Next.js application without needing a separate backend." },
    ],
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
