// src/config/index.ts
const env = require("./env");

module.exports.dbConfig = {
	url: env.DATABASE_URL,
};

module.exports.authConfig = {
	jwtSecret: env.JWT_SECRET,
};

module.exports.appConfig = {
	port: env.PORT,
	nodeEnv: env.NODE_ENV,
};
