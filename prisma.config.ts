import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, env } from "prisma/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
    schema: "./src/db/prisma",
    enums: "./src/db/prisma/enums",
    migrations: {
        path: "./src/db/prisma/migrations",
    },
    datasource: {
        url: env("DATABASE_URL"),
    },
    generator: {
        client: {
            provider: "prisma-client-js",
        },
    },
});
