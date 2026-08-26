// types/request.ts
import { type Request } from "express";

export interface TypedRequest<
	TBody = unknown,
	TParams = unknown,
	TQuery = unknown,
> extends Request {
	/** Validated data from the primary source (body by default) */
	validatedData: TBody;
	/** Validated body data */
	validatedBody?: TBody;
	/** Validated params data */
	validatedParams?: TParams;
	/** Validated query data */
	validatedQuery?: TQuery;
}