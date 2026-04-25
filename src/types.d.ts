import { PaginationMeta } from "./utils/pagination.util.js";

declare global {
	namespace Express {
		interface Request {
			pagination: PaginationMeta;
		}
	}
}
