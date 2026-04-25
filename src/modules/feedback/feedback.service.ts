import supabase from "../../lib/db.js";
import type { PaginationQuery } from "../../middlewares/pagination.js";
import { buildPaginatedResponse } from "../../utils/pagination.util.js";
import type { Feedback } from "./feedback.schema.js";

const feedbackService = {
	async submitFeedback(feedbackData: Feedback) {
		const { error } = await supabase
			.from("feedback")
			.insert([{ ...feedbackData }]);

		if (error) {
			console.error("Feedback DB Error:", error.message);
			throw new Error("error submitting feedback.");
		}
	},

	async getFeedbacks(pagination: PaginationQuery) {
		const { page, limit, sortOrder } = pagination;
		const from = (page - 1) * limit;
		const feedbacks = await supabase
			.from("feedback")
			.select("name, email, category, message")
			.order("submitted_at", { ascending: sortOrder === "asc" })
			.range(from, from + limit);

		if (feedbacks.error) {
			console.error("Feedback DB Error:", feedbacks.error.message);
			throw new Error("error fetching feedback.");
		}

		return buildPaginatedResponse(
			feedbacks.data ?? [],
			feedbacks.count ?? feedbacks.data.length ?? 0,
			page,
			limit,
		);
	},
};

export default feedbackService;
