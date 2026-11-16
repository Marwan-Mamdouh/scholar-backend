import z from "zod";
import dotenv from "dotenv";

dotenv.config();

const normalizeEnvString = (value: unknown) => {
	if (typeof value !== "string") return value;
	const trimmed = value.trim();
	return trimmed === "" ? undefined : trimmed;
};

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.coerce.number().positive().default(3000),
	GEMINI_API_KEY: z.string().min(32).optional(),

	BETTER_AUTH_SECRET: z.preprocess(normalizeEnvString, z.string().min(1).optional()),
	BETTER_AUTH_URL: z.preprocess(normalizeEnvString, z.string().url().optional()),

	SUPABASE_URL: z.preprocess(normalizeEnvString, z.url().optional()),
	SUPABASE_KEY: z.preprocess(normalizeEnvString, z.string().min(1).optional()),
	S2_API_KEY: z.string().min(32).optional(),
	SUPABASE_ANON_KEY: z.string().min(32).optional(),
	SUPABASE_SERVICE_ROLE_KEY: z.preprocess(normalizeEnvString, z.string().min(32).optional()),
	VERCEL: z.string().optional(),

	SMTP_HOST: z.preprocess(normalizeEnvString, z.string().optional()),
	SMTP_PORT: z.preprocess(normalizeEnvString, z.coerce.number().positive().optional()),
	SMTP_USER: z.preprocess(normalizeEnvString, z.string().optional()),
	SMTP_PASS: z.preprocess(normalizeEnvString, z.string().optional()),
	EMAIL_FROM: z.preprocess(normalizeEnvString, z.string().optional()),

	DATABASE_URL: z.string().min(1).optional(),
	DIRECT_URL: z.preprocess(normalizeEnvString, z.string().min(1).optional()),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error("❌ Invalid environment variables:");
	console.error(z.treeifyError(parsed.error).errors.join("\n"));
	if (!process.env.VERCEL) {
		process.exit(1);
	}
	console.warn(
		"Continuing with safe fallbacks because VERCEL is set. Please fix env vars.",
	);
}

type EnvShape = z.infer<typeof envSchema>;
const safeEnv: Partial<EnvShape> = parsed.success ? parsed.data : {};

export default {
	NODE_ENV: safeEnv.NODE_ENV ?? "development",
	PORT: safeEnv.PORT ?? 3000,
	GEMINI_API_KEY: safeEnv.GEMINI_API_KEY,

	BETTER_AUTH_SECRET: safeEnv.BETTER_AUTH_SECRET,
	BETTER_AUTH_URL: safeEnv.BETTER_AUTH_URL,
	SUPABASE_URL: safeEnv.SUPABASE_URL ?? "",
	SUPABASE_KEY: safeEnv.SUPABASE_KEY ?? "",
	S2_API_KEY: safeEnv.S2_API_KEY,
	SUPABASE_SERVICE_ROLE_KEY: safeEnv.SUPABASE_SERVICE_ROLE_KEY,
	VERCEL: safeEnv.VERCEL,

	SMTP_HOST: safeEnv.SMTP_HOST,
	SMTP_PORT: safeEnv.SMTP_PORT,
	SMTP_USER: safeEnv.SMTP_USER,
	SMTP_PASS: safeEnv.SMTP_PASS,
	EMAIL_FROM: safeEnv.EMAIL_FROM,

	DATABASE_URL: safeEnv.DATABASE_URL,
	DIRECT_URL: safeEnv.DIRECT_URL,
};