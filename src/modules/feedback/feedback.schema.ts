import z from "zod";

export const feedbackSchema = z.object({
	name: z.string(),
	email: z.email(),
	category: z.enum(["bug", "feature", "data", "other"]).default("other"),
	message: z.string(),
});

export type Feedback = z.infer<typeof feedbackSchema>;
