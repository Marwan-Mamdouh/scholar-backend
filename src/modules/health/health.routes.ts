import { Router, type Response } from "express";
import supabase from "../../lib/db.js";
import env from "../../config/env.js";

const router = Router();
// Deploy / env diagnostics (no secrets). Open in browser if Vercel logs are unavailable.
router.get("/", (_, res: Response) => {
	const keyPresent = !!(env.SUPABASE_KEY || env.SUPABASE_SERVICE_ROLE_KEY);
	res.json({
		ok: true,
		supabaseConfigured: !!(env.SUPABASE_URL && keyPresent),
		clientReady: !!supabase,
		vercel: !!env.VERCEL,
		node: process.version,
	});
});

export default router;
