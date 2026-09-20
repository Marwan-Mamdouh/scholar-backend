import { Router, type Response } from "express";
import asyncHandler from "../../lib/async.handler.js";
import { paginationMiddleware } from "../../middlewares/pagination.js";
import { validate } from "../../middlewares/validator.js";
import type { PaginatedRequest } from "../../types/paginatedRequest.js";
import type { TypedRequest } from "../../types/Request.js";
import gradProjectsService from "./grad-projects.service.js";
import {
	gradProjectFilterSchema,
	type GradProjectFilter,
} from "./grad-projects.schema.js";

const router = Router();

// GET /facets -> distinct filter values: { universities, years, domains }
// (Registered before "/" so "facets" is never parsed as a param.)
router.get(
	"/facets",
	asyncHandler(async (_, res: Response) => {
		const facets = await gradProjectsService.facets();
		res.json({ data: facets });
	}),
);

router.get(
	"/",
	paginationMiddleware,
	validate(gradProjectFilterSchema, "query"),
	asyncHandler(
		async (
			req: PaginatedRequest & TypedRequest<GradProjectFilter>,
			res: Response,
		) => {
			const result = await gradProjectsService.search(
				req.validatedData,
				req.pagination,
			);
			res.json(result);
		},
	),
);

export default router;
