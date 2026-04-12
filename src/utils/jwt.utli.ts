const JWT_SECRET = require("../config").authConfig.jwtSecret;
const jwt = require("jsonwebtoken");

const generateToken = (user: any): string => {
	const token = jwt.sign(
		{ id: user.id, role: user.role, name: user.name },
		JWT_SECRET,
		{ expiresIn: "24h" },
	);
	return token;
};

const verifyToken = (token: string) => {
	const decoded = jwt.verify(token, JWT_SECRET);
	return decoded;
};

module.exports = { generateToken, verifyToken };
