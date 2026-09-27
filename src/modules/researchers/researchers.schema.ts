/*import { z } from "zod";

export const FilterQuerySchema = z.object({
	mainTopic: z.string().optional(),
	subtopics: z.string().optional(),
	institutionName: z.string().optional(),
	researcher: z.string().optional(),
	scholarId: z.string().optional(),
	department: z.string().optional(),
	keywords: z.string().optional(),
});

export const UploadOptionsSchema = z.object({
	clear_db: z
		.string()
		.optional()
		.transform((val) => val === "true")
		.default(false),
	mainTopic: z.string().optional(),
});

export const AnalyzeRequestSchema = z.object({
	id: z.union([z.number(), z.string()]).transform(Number),
});

export const ResearcherSchema = z.object({
	id: z.number().optional(),
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	institutionName: z.string().min(1),
	department: z.string().optional(),
	affiliation: z.string().optional(),
	mainTopic: z.string().optional(),
	subtopics: z.array(z.string()).optional(),
	scholarId: z.string().optional(),
	linkedinUrl: z.string().url().optional(),
});

export type FilterQuery = z.infer<typeof FilterQuerySchema>;
export type UploadOptions = z.infer<typeof UploadOptionsSchema>;
export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
export type Researcher = z.infer<typeof ResearcherSchema>;

*/