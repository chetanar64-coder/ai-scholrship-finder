import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string | undefined {
  // On Vercel serverless environment, copy sqlite db to writable /tmp if needed
  if (process.env.VERCEL) {
    try {
      const sourceDb = path.join(process.cwd(), "prisma", "dev.db");
      const targetDb = path.join("/tmp", "dev.db");
      if (fs.existsSync(sourceDb) && !fs.existsSync(targetDb)) {
        fs.copyFileSync(sourceDb, targetDb);
      }
      if (fs.existsSync(targetDb)) {
        return `file:${targetDb}`;
      }
      if (fs.existsSync(sourceDb)) {
        return `file:${sourceDb}`;
      }
    } catch (e) {
      console.warn("Could not setup SQLite database in /tmp:", e);
    }
  }

  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const defaultPath = path.join(process.cwd(), "prisma", "dev.db");
  if (fs.existsSync(defaultPath)) {
    return `file:${defaultPath}`;
  }

  return undefined;
}

const dbUrl = getDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
