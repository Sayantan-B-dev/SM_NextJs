import { PrismaClient } from "@prisma/client";

// PrismaClient singleton pattern:
// Prevents multiple instances during Next.js hot-reloading in development.
// In production, a single instance is used server-wide.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
