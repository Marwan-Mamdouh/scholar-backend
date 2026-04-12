// Plain JS logger for Node/Vercel (avoids loading env.ts + process.exit on cold start)

const colors = {
	reset: "\x1b[0m",
	gray: "\x1b[90m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	red: "\x1b[31m",
};

const statusColorMap = {
	info: colors.green,
	warn: colors.yellow,
	error: colors.red,
};

const getLevel = (status) =>
	status >= 500 ? "error" : status >= 400 ? "warn" : "info";

const sanitizeBody = (body) => {
	if (!body) return undefined;
	const clone = { ...body };
	["password", "token", "accessToken"].forEach((key) => {
		if (key in clone) clone[key] = "***";
	});
	return clone;
};

const logger = (req, res, next) => {
	const start = process.hrtime.bigint();

	res.on("finish", () => {
		const duration = Number(process.hrtime.bigint() - start) / 1e6;
		const log = {
			timestamp: new Date().toISOString(),
			method: req.method,
			path: req.originalUrl,
			statusCode: res.statusCode,
			duration: `${duration.toFixed(2)}ms`,
			...(Object.keys(req.query).length && { query: req.query }),
			...(req.body &&
				Object.keys(req.body).length && {
					body: sanitizeBody(req.body),
				}),
		};
		const level = getLevel(res.statusCode);
		if (process.env.NODE_ENV === "production") {
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
