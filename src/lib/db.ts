import { createClient } from "@supabase/supabase-js";
import ws from "ws";
import env from "../config/env.js";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
    // realtime: {
    //     transport: ws,
    // },
});

export default supabase;