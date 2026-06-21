import { TeamCategory } from "@prisma/client";
import prisma from "../../lib/prisma.js";
import { NotFoundError } from "../../lib/error/index.js";
import type { CreateTeamMember, UpdateTeamMember } from "./team.schema.js";

// getAll returns one bucket per team category so the frontend can render each
// section directly. Empty categories still appear as empty arrays.
async function getAll() {
	const members = await prisma.teamMember.findMany({
		orderBy: { createdAt: "asc" },
	});

	// Start with an empty array for every category so the frontend always gets
	// a consistent shape, then drop each member into its bucket.
	const grouped = Object.values(TeamCategory).reduce((acc, category) => {
		acc[category] = [];
		return acc;
	}, {} as Record<TeamCategory, typeof members>);

	for (const member of members) {
		grouped[member.team].push(member);
	}

	return grouped;
}

async function getById(id: number) {
	const member = await prisma.teamMember.findUnique({ where: { id } });

	if (!member) {
		throw new NotFoundError(`Team member with id ${id} not found`);
	}

	return member;
}

async function create(data: CreateTeamMember) {
	return prisma.teamMember.create({ data });
}

async function update(id: number, data: UpdateTeamMember) {
	// Ensure it exists first so we return a clean 404 instead of a Prisma error.
	await getById(id);
	return prisma.teamMember.update({ where: { id }, data });
}

async function remove(id: number) {
	await getById(id);
	await prisma.teamMember.delete({ where: { id } });
}

const teamService = {
	getAll,
	getById,
	create,
	update,
	remove,
};

export default teamService;
