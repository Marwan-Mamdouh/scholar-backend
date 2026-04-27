import type { TypedRequest } from "../types/Request.js";
import type { NextFunction, Response } from "express";
import type { z } from "zod";

export const validate =
	<T>(schema: z.ZodType<T>) =>
	(req: TypedRequest<T>, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			return res.status(400).json({ errors: result.error });
		}

		req.validatedData = result.data;
		next();
	};

export const validateQuery =
	<T>(schema: z.ZodType<T>) =>
	(req: any, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.query);

		if (!result.success) {
			return res.status(400).json({ errors: result.error });
		}

		req.validatedQuery = result.data;
		next();
	};
