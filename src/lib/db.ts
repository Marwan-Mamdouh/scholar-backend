import { createClient } from "@supabase/supabase-js";
import env from "../config/env.js";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY, {
	auth: {
		persistSession: false,
		autoRefreshToken: false,
	},
});

export default supabase;
