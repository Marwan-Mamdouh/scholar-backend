// src/config/index.ts
import env from "./env.js";

export const dbConfig = {
	url: env.DATABASE_URL,
};

export const authConfig = {
	jwtSecret: env.JWT_SECRET,
};

export const appConfig = {
	port: env.PORT,
	nodeEnv: env.NODE_ENV,
};
