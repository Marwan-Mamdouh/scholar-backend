export interface PaginatedResponse<T> {
	data: T[];
	meta: {
		page: number;
		limit: number;
		totalItems: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
}

export const buildPaginatedResponse = <T>(
	data: T[],
	totalItems: number,
	page: number,
	limit: number,
): PaginatedResponse<T> => {
	const totalPages = Math.ceil(totalItems / limit);

	return {
		data,
		meta: {
			page,
			limit,
			totalItems,
			totalPages,
			hasNextPage: page < totalPages,
			hasPrevPage: page > 1,
		},
	};
};

export interface PaginationMeta {
	page: number;
	limit: number;
	offset: number;
	sortBy: string;
	sortOrder: "asc" | "desc";
}
