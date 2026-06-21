import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 requires an explicit driver adapter; we use the node-postgres
// adapter pointed at DATABASE_URL.
const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});

// A single PrismaClient instance is reused across the app (and across hot
// reloads in dev) to avoid exhausting the database connection pool.
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

export default prisma;
