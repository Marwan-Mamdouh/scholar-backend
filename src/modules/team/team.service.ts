import { TeamCategory, type TeamMember } from "@prisma/client";
import db from "../../db/db_config.js";
import { NotFoundError } from "../../lib/error/index.js";
import type { CreateTeamMember, UpdateTeamMember } from "./team.schema.js";

type GroupedMembers = Record<TeamCategory, TeamMember[]>;

const teamService = {
	// Returns one bucket per team category so the frontend can render each
	// section directly. Categories with no members still come back as [].
	async getAll(): Promise<GroupedMembers> {
		const members = await db.teamMember.findMany({
			orderBy: { createdAt: "asc" },
		});

		// Seed an empty bucket per category (the 3 enum values) to keep the shape
		// stable, then walk the members once, dropping each into its bucket.
		const grouped = Object.fromEntries(
			Object.values(TeamCategory).map((category) => [category, []]),
		) as GroupedMembers;

		for (const member of members) {
			grouped[member.team].push(member);
		}

		return grouped;
	},

	async getById(id: number): Promise<TeamMember> {
		const member = await db.teamMember.findUnique({ where: { id } });

		if (!member) {
			throw new NotFoundError(`Team member with id ${id} not found`);
		}

		return member;
	},

	async create(data: CreateTeamMember): Promise<TeamMember> {
		return db.teamMember.create({ data });
	},

	async update(id: number, data: UpdateTeamMember): Promise<TeamMember> {
		// Ensure it exists first so we return a clean 404 instead of a Prisma error.
		await teamService.getById(id);
		return db.teamMember.update({ where: { id }, data });
	},

	async remove(id: number): Promise<void> {
		await teamService.getById(id);
		await db.teamMember.delete({ where: { id } });
	},
};

export default teamService;
