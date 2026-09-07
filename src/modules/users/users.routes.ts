import { Router, type Request, type Response } from "express";
// import isAuthenticated from "../../middlewares/auth.js";
// import isAdmin from "../../middlewares/authorize.js";
import asyncHandler from "../../lib/async.handler.js";
// import { validate, validateMultiple } from "../../middlewares/validator.js";
import usersService from "./users.service.js";
import { uploadCV } from "../../middlewares/uploads.js";
// import type { TypedRequest } from "../../types/Request.js";
// import type { PaginatedRequest } from "../../types/paginatedRequest.js";
// import { paginationMiddleware as pagination } from "../../middlewares/pagination.js"; 

const router = Router();

router.post(
    "/cv_parser",
    uploadCV.single("file"),
    asyncHandler(async (req: Request, res: Response) => {
		if (!req.file?.buffer) {
			return res
				.status(400)
				.json({ error: "No file uploaded or invalid format" });
		}
		const ParsedData = await usersService.ParseCv(req.file.buffer, req.file.originalname);
		res.status(200).json({
            success: ParsedData?.success,
            message: ParsedData?.success?"Cv Parsed succesfully":"Error While parsing the CV", 
            data: ParsedData 
        });
    })

)

export default router;