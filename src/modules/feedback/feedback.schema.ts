import z from "zod";

export const feedbackSchema = z.object({
	name: z.string().trim().max(100),
	email: z.email().max(255).optional(),
	category: z.enum(["bug", "feature", "data", "other"]).default("other"),
	message: z.string().trim().max(2000),
});

export type Feedback = z.infer<typeof feedbackSchema>;
