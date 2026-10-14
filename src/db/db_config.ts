import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

export const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db_adapter = new PrismaPg({ connectionString });

export const db =
    globalForPrisma.prisma ?? new PrismaClient({ adapter: db_adapter });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = db;
}