import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types/AuthRequest.js";

const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
	const user = req.user as any;
	if (!user || user.role !== "admin") {
		return res.status(403).json({ error: "Access Denied. Admins only." });
	}
	next();
};

export default isAdmin;
