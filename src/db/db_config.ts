import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
dotenv.config();

export const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");
export const db_adapter = new PrismaPg({ connectionString });
export const db_client = new PrismaClient({ adapter: db_adapter });

export default db_client;
