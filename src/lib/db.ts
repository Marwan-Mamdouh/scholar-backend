const { createClient } = require("@supabase/supabase-js");
const env = require("../config/env");

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY, {
	auth: {
		persistSession: false,
		autoRefreshToken: false,
	},
});

module.exports = supabase;
