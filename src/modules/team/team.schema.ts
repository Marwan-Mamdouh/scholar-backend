import z from "zod";

// Mirrors the TeamMember prisma model. `team` is constrained to the same
// values as the TeamCategory enum in the schema.
export const createTeamMemberSchema = z.object({
	name: z.string().min(1),
	role: z.string().min(1),
	linkedinUrl: z.url().optional(),
	team: z.enum(["web", "industry", "academia"]),
});

// PATCH updates any subset of fields, so every field becomes optional.
export const updateTeamMemberSchema = createTeamMemberSchema.partial();

export const teamIdSchema = z.object({
	id: z.coerce.number().int().positive(),
});

export type CreateTeamMember = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMember = z.infer<typeof updateTeamMemberSchema>;
