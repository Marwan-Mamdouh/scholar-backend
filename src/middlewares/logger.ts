import type { Request, Response, NextFunction } from "express";
import appConfig from "../config/env.js";

// --- tiny color utility (no heavy deps like chalk)
const colors = {
	reset: "\x1b[0m",
	gray: "\x1b[90m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	red: "\x1b[31m",
};

// map status → color (NO if spam)
const statusColorMap = {
	info: colors.green,
	warn: colors.yellow,
	error: colors.red,
} as const;

const getLevel = (status: number): keyof typeof statusColorMap =>
	status >= 500 ? "error" : status >= 400 ? "warn" : "info";

// sanitize sensitive fields (extend later if needed)
export function sanitizeBody(
	body: any,
	sensitiveKeys = ["password", "token", "accesstoken", "secret"],
): any {
	if (!body) return undefined;

	const keysToMask = new Set(sensitiveKeys.map((k) => k.toLowerCase()));

	try {
		return JSON.parse(
			JSON.stringify(body, (key, value) => {
				if (key && keysToMask.has(key.toLowerCase())) {
					return "MASKED";
				}
				return value;
			}),
		);
	} catch {
		// Fallback in case of circular references or serialization error
		return body;
	}
}

const logger = (req: Request, res: Response, next: NextFunction) => {
	const start = process.hrtime.bigint();

	res.on("finish", () => {
		const duration = Number(process.hrtime.bigint() - start) / 1e6;

		const log = {
			timestamp: new Date().toISOString(),
			method: req.method,
			path: req.originalUrl, // better than req.path
			statusCode: res.statusCode,
			duration: `${duration.toFixed(2)}ms`,
			...(Object.keys(req.query).length && { query: req.query }),
			...(req.body &&
				Object.keys(req.body).length && {
					body: sanitizeBody(req.body),
				}),
		};

		const level = getLevel(res.statusCode);

		// dev-friendly colored output
		if (appConfig.NODE_ENV === "production") {
			// production → structured logs
			console.log(JSON.stringify({ level, ...log }));
		} else {
			const color = statusColorMap[level];

			console.log(
				`${colors.gray}[${log.timestamp}]${colors.reset} ` +
					`${log.method} ${log.path} ` +
					`${color}${log.statusCode}${colors.reset} ` +
					`${colors.gray}${log.duration}${colors.reset}`,
			);
		}
	});

	next();
};

export default logger;
