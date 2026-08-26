import type { TypedRequest } from "../types/Request.js";
import type { NextFunction, Response } from "express";
import type { z } from "zod";

export const validate =
	<T>(schema: z.ZodType<T>, key: "body" | "query" | "params" = "body") =>
	(req: TypedRequest<T>, _: Response, next: NextFunction) => {
		const result = schema.safeParse(req[key]);

		if (!result.success) {
			return next(result.error);
		}

		req.validatedData = result.data;
		next();
	};

interface ValidateMultipleConfig<TBody, TParams, TQuery> {
	body?: z.ZodType<TBody>;
	params?: z.ZodType<TParams>;
	query?: z.ZodType<TQuery>;
}

export const validateMultiple = <
	TBody = unknown,
	TParams = unknown,
	TQuery = unknown,
>(
	config: ValidateMultipleConfig<TBody, TParams, TQuery>,
) => {
	return (
		req: TypedRequest<TBody, TParams, TQuery>,
		_: Response,
		next: NextFunction,
	) => {
		if (config.body) {
			const result = config.body.safeParse(req.body);
			if (!result.success) return next(result.error);
			req.validatedBody = result.data;
			req.validatedData = result.data;
		}

		if (config.params) {
			const result = config.params.safeParse(req.params);
			if (!result.success) return next(result.error);
			req.validatedParams = result.data;
		}

		if (config.query) {
			const result = config.query.safeParse(req.query);
			if (!result.success) return next(result.error);
			req.validatedQuery = result.data;
		}

		next();
	};
};
