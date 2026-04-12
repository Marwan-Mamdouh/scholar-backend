const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config").authConfig.jwtSecret;

const isAdmin = (req, res, next) => {
	const token = req.cookies.auth_token; // tokens from cookies

	if (!token) {
		return res.status(401).json({ error: "Access Denied. No token provided." });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		if (decoded.role !== "admin") {
			return res.status(403).json({ error: "Access Denied. Admins only." });
		}
		req.user = decoded; // save if needed
		next(); // pass
	} catch (ex) {
		console.error("Token verification failed:", ex);
		res.status(400).json({ error: "Invalid token." });
	}
};

module.exports = isAdmin;
