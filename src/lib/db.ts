import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import env from "../config/env.js";

/**
 * Supabase is optional here: the data now lives in Postgres behind Prisma, and
 * `.env` ships with SUPABASE_URL/SUPABASE_KEY empty. Creating the client at
 * import time therefore crashed the whole server on boot with
 * "supabaseUrl is required", even though nothing on the request path used it.
 *
 * The client is built on first use instead, so an unconfigured install boots and
 * only the code paths that actually need Supabase fail — with a message that
 * says what to set.
 */
export const isSupabaseConfigured = Boolean(
	env.SUPABASE_URL && (env.SUPABASE_KEY || env.SUPABASE_SERVICE_ROLE_KEY),
);

let client: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
	if (client) return client;

	if (!isSupabaseConfigured) {
		throw new Error(
			"Supabase is not configured. Set SUPABASE_URL and SUPABASE_KEY in .env to use this feature.",
		);
	}

	client = createClient(env.SUPABASE_URL, env.SUPABASE_KEY, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	});
	return client;
};

/**
 * Keeps the existing `supabase.from(...)` / `supabase.storage` call sites working
 * while deferring construction to the first property access. Methods are bound to
 * the real client so `this` still points at it.
 */
const supabase = new Proxy({} as SupabaseClient, {
	get(_target, property) {
		const instance = getSupabase() as unknown as Record<
			string | symbol,
			unknown
		>;
		const value = instance[property];
		return typeof value === "function" ? value.bind(instance) : value;
	},
});

export default supabase;
