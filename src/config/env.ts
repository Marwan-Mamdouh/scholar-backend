import z from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.coerce.number().positive().default(3000),
	JWT_SECRET: z.string().min(1),
	GEMINI_API_KEY: z.string().min(32).optional(),

	SUPABASE_URL: z.url(),
	SUPABASE_KEY: z.string().min(1),
	S2_API_KEY: z.string().min(32).optional(),
	SUPABASE_ANON_KEY: z.string().min(32).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error("❌ Invalid environment variables:");
	console.error(parsed.error.flatten().fieldErrors);
	// Avoid process.exit(1) on Vercel — it surfaces as FUNCTION_INVOCATION_FAILED with no response body.
	if (!process.env.VERCEL) {
		process.exit(1);
	}
	throw new Error(
		"Invalid environment configuration (see logs for field errors).",
	);
}

export default parsed.data;
