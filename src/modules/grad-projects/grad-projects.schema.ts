import { z } from "zod";

const emptyToUndefined = (value: unknown) => {
	if (typeof value !== "object" || value === null || Array.isArray(value)) {
		return value;
	}
	const cleaned: Record<string, unknown> = { ...(value as Record<string, unknown>) };
	for (const key of Object.keys(cleaned)) {
		if (cleaned[key] === "") delete cleaned[key];
	}
	return cleaned;
};

export const gradProjectFilterSchema = z.preprocess(
	emptyToUndefined,
	z.object({
		q: z.string().trim().min(1).max(200).optional(),
		university: z.string().trim().min(1).max(200).optional(),
		graduationYear: z
			.string()
			.regex(/^\d{4}$/, "graduationYear must be YYYY")
			.transform(Number)
			.pipe(z.number().int().min(1900).max(2100))
			.optional(),
		domain: z.string().trim().min(1).max(200).optional(),
		isSponsored: z
			.enum(["true", "false"])
			.transform((value) => value === "true")
			.optional(),
	}),
);

export type GradProjectFilter = z.infer<typeof gradProjectFilterSchema>;
