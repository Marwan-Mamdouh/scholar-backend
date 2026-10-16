import dns from "node:dns";
import net from "node:net";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

// Neon resolves to IPv6 addresses on this host, but the IPv6 route silently drops
// packets, so Node's Happy Eyeballs (enabled by default since Node 20) hangs on the
// IPv6 attempt and every query fails with ETIMEDOUT. Pin resolution to IPv4 and turn
// off Happy Eyeballs so connections go straight to the reachable IPv4 address.
dns.setDefaultResultOrder("ipv4first");
net.setDefaultAutoSelectFamily(false);

export const connectionString =
    process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db_adapter = new PrismaPg({
    connectionString,
    // Neon cold starts can exceed the 15s default embedded in the URL.
    connectionTimeoutMillis: 30_000,
    // Keep the pool small so idle connections never go stale between requests.
    max: 5,
    idleTimeoutMillis: 30_000,
});

export const db =
    globalForPrisma.prisma ?? new PrismaClient({ adapter: db_adapter });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = db;
}