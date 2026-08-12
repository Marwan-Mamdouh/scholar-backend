import { describe, it, expect, vi, beforeEach } from "vitest";
import teamService from "../team.service.js";
import { db } from "../../../db/db_config.js";
import { NotFoundError } from "../../../lib/error/index.js";

vi.mock("../../../db/db_config.js", () => ({
	default: {
		teamMember: {
			findMany: vi.fn(),
			findUnique: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
		},
	},
}));

const member = (overrides: Partial<Record<string, unknown>> = {}) => ({
	id: 1,
	name: "Mohamed Gad",
	role: "VLSI Engineer & full stack",
	linkedinUrl: "https://www.linkedin.com/in/mohamed-gad-075179253",
	team: "web",
	createdAt: new Date(),
	updatedAt: new Date(),
	...overrides,
});

describe("teamService", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("getAll", () => {
		it("groups members by team and always returns every category", async () => {
			(db.teamMember.findMany as any).mockResolvedValue([
				member({ id: 1, team: "web" }),
				member({ id: 2, team: "web" }),
				member({ id: 3, team: "industry" }),
			]);

			const result = await teamService.getAll();

			expect(Object.keys(result).sort()).toEqual([
				"academia",
				"industry",
				"web",
			]);
			expect(result.web).toHaveLength(2);
			expect(result.industry).toHaveLength(1);
			expect(result.academia).toEqual([]);
		});
	});

	describe("getById", () => {
		it("returns the member when found", async () => {
			const found = member({ id: 7 });
			(db.teamMember.findUnique as any).mockResolvedValue(found);

			await expect(teamService.getById(7)).resolves.toEqual(found);
			expect(db.teamMember.findUnique).toHaveBeenCalledWith({
				where: { id: 7 },
			});
		});

		it("throws NotFoundError when missing", async () => {
			(db.teamMember.findUnique as any).mockResolvedValue(null);

			await expect(teamService.getById(99)).rejects.toBeInstanceOf(
				NotFoundError,
			);
		});
	});

	describe("create", () => {
		it("delegates to db.create with the given data", async () => {
			const input = {
				name: "Amr Wahidi",
				role: "Software Developer",
				team: "web" as const,
			};
			const created = member({ id: 2, ...input });
			(db.teamMember.create as any).mockResolvedValue(created);

			await expect(teamService.create(input)).resolves.toEqual(created);
			expect(db.teamMember.create).toHaveBeenCalledWith({ data: input });
		});
	});

	describe("update", () => {
		it("updates an existing member", async () => {
			(db.teamMember.findUnique as any).mockResolvedValue(member({ id: 1 }));
			const updated = member({ id: 1, role: "Lead" });
			(db.teamMember.update as any).mockResolvedValue(updated);

			await expect(
				teamService.update(1, { role: "Lead" }),
			).resolves.toEqual(updated);
			expect(db.teamMember.update).toHaveBeenCalledWith({
				where: { id: 1 },
				data: { role: "Lead" },
			});
		});

		it("throws NotFoundError and never updates when missing", async () => {
			(db.teamMember.findUnique as any).mockResolvedValue(null);

			await expect(
				teamService.update(99, { role: "Lead" }),
			).rejects.toBeInstanceOf(NotFoundError);
			expect(db.teamMember.update).not.toHaveBeenCalled();
		});
	});

	describe("remove", () => {
		it("deletes an existing member", async () => {
			(db.teamMember.findUnique as any).mockResolvedValue(member({ id: 1 }));
			(db.teamMember.delete as any).mockResolvedValue(member({ id: 1 }));

			await teamService.remove(1);

			expect(db.teamMember.delete).toHaveBeenCalledWith({
				where: { id: 1 },
			});
		});

		it("throws NotFoundError and never deletes when missing", async () => {
			(db.teamMember.findUnique as any).mockResolvedValue(null);

			await expect(teamService.remove(99)).rejects.toBeInstanceOf(
				NotFoundError,
			);
			expect(db.teamMember.delete).not.toHaveBeenCalled();
		});
	});
});
