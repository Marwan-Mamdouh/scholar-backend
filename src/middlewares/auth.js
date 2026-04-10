const { Request, Response, NextFunction } = require("express");

const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config").authConfig.jwtSecret;

// Middleware to extract user from token (Reuse your isAdmin logic or make a generic one)
const isAuthenticated = (req, res, next) => {
	const token = req.cookies.auth_token;
	if (!token) return res.status(401).json({ error: "Access Denied" });
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded;
		next();
	} catch (ex) {
		console.error("Token verification failed:", ex);
		res.status(400).json({ error: "Invalid token." });
	}
};
