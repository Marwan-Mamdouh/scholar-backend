import type { Request, Response, NextFunction, RequestHandler } from "express";

const asyncHandler =
	<
		TReq extends Request = Request,
		TRes extends Response = Response,
	>(
		fn: (req: TReq, res: TRes, next: NextFunction) => Promise<unknown> | unknown,
	): RequestHandler =>
	(req: Request, res: Response, next: NextFunction) =>
		Promise.resolve(fn(req as TReq, res as TRes, next)).catch(next);

export default asyncHandler;

