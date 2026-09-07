import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/authentication/auth.js";
import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/AuthRequest.js";

const isAuthenticated = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const session = await auth.api.getSession({
			headers: fromNodeHeaders(req.headers),
		});
		if (!session) {
			return res.status(401).json({ error: "Access Denied. No session." });
		}
		req.user = session.user;
		req.session = session.session;
		next();
	} catch (ex) {
		console.error("Session verification failed:", ex);
		res.status(401).json({ error: "Invalid session." });
	}
};

export default isAuthenticated;
