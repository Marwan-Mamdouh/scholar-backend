const z = require("zod");
const dotenv = require("dotenv");

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.coerce.number().positive().default(3000),
	JWT_SECRET: z.string().min(32),
	GEMINI_API_KEY: z.string().min(32),
	SUPABASE_URL: z.string().url(),
	SUPABASE_KEY: z.string().min(32),
	S2_API_KEY: z.string().min(32),
	SUPABASE_ANON_KEY: z.string().min(32),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error("❌ Invalid environment variables:");
	console.error(parsed.error.flatten().fieldErrors);
	process.exit(1); // fail fast
}

module.exports = parsed.data;
