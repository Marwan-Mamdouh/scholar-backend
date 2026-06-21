import { Router, type Request, type Response } from "express";
import asyncHandler from "../../lib/async.handler.js";
import { validate } from "../../middlewares/validator.js";
import teamService from "./team.service.js";
import {
	createTeamMemberSchema,
	updateTeamMemberSchema,
	teamIdSchema,
	type CreateTeamMember,
	type UpdateTeamMember,
} from "./team.schema.js";
import type { TypedRequest } from "../../types/Request.js";

const router = Router();

// GET / -> all members grouped by team: { data: { web: [...], ... } }
router.get(
	"/",
	asyncHandler(async (_: Request, res: Response) => {
		const data = await teamService.getAll();
		res.status(200).json({ data });
	}),
);

// GET /:id -> a single member: { data: {...} } (404 if missing)
router.get(
	"/:id",
	asyncHandler(async (req: Request, res: Response) => {
		const { id } = teamIdSchema.parse(req.params);
		const data = await teamService.getById(id);
		res.status(200).json({ data });
	}),
);

// POST / -> create a member: { data: {...} }
router.post(
	"/",
	validate(createTeamMemberSchema),
	asyncHandler(async (req: TypedRequest<CreateTeamMember>, res: Response) => {
		const data = await teamService.create(req.validatedData);
		res.status(201).json({ data });
	}),
);

// PATCH /:id -> update a member: { data: {...} } (404 if missing)
router.patch(
	"/:id",
	validate(updateTeamMemberSchema),
	asyncHandler(async (req: TypedRequest<UpdateTeamMember>, res: Response) => {
		const { id } = teamIdSchema.parse(req.params);
		const data = await teamService.update(id, req.validatedData);
		res.status(200).json({ data });
	}),
);

// DELETE /:id -> 204 No Content (404 if missing)
router.delete(
	"/:id",
	asyncHandler(async (req: Request, res: Response) => {
		const { id } = teamIdSchema.parse(req.params);
		await teamService.remove(id);
		res.status(204).send();
	}),
);

export default router;
