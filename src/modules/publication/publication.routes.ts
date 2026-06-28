import { Router, type Request, type Response } from "express";
import isAuthenticated from "../../middlewares/auth.js";
import isAdmin from "../../middlewares/authorize.js";
import asyncHandler from "../../lib/async.handler.js";
import { validate } from "../../middlewares/validator.js";
import { domainFilterSchema, domainSchema , publicationIDSchema, publicationMetricsIDSchema, publicationMetricsPatchSchema, publicationMetricsSchema, publicationPatchSchema, publicationSchema, subCategoryFilterSchema, subCategorySchema, type domain, type domainFilter, type publication, type publicationID, type publicationMetrics, type publicationMetricsID, type publicationMetricsPatch, type publicationPatch, type subCategory, type subCategoryFilter } from "./publication.schema.js";
import publicationService from "./publication.service.js";
import type { TypedRequest } from "../../types/Request.js";
import type { PaginatedRequest } from "../../types/paginatedRequest.js";
import { paginationMiddleware as pagination } from "../../middlewares/pagination.js"; 

const router = Router();

// ? domains 

// post admin
router.post(
    "/publication/domain",
    isAuthenticated,
    isAdmin,
	validate(domainSchema),
    asyncHandler(async (req: TypedRequest<domain>, res: Response) => {
		const domainData = req.validatedData;
		const addedDomain = await publicationService.addDomain(domainData);
		res.status(201).json({ success: true, message: "publication domain added.", data: addedDomain });
    })
)


// get all
router.get(
    "/publication/domain",
    asyncHandler(async (req: Request, res: Response) => {
		const domains = await publicationService.getAllDomains();
		res.json(domains);
    })
)
// delete admin
router.delete(
    "/publication/domain",
	isAuthenticated,
    isAdmin,
	validate(domainFilterSchema),
    asyncHandler(async (req: TypedRequest<domainFilter>, res: Response) => {
		const domainFilter = req.validatedData;
		await publicationService.removeDomain(domainFilter);
		res.status(204);
    })
)

// ? sub cat

// post admin
router.post(
    "/publication/subCategory",
	isAuthenticated,
    isAdmin,
	validate(subCategorySchema),
    asyncHandler(async (req: TypedRequest<subCategory>, res: Response) => {
		const subCategoryData = req.validatedData;
		const addedSubCategory = await publicationService.addSubCategory(subCategoryData);
		res.status(201).json({ success: true, message: "publication subCategory added.", data: addedSubCategory });
    })
)

// get all
router.get(
    "/publication/subCategory",
    asyncHandler(async (req: Request, res: Response) => {
		const subcategories = await publicationService.getAllSubcategories();
		res.json(subcategories);
    })
)

// delete admin
router.delete(
    "/publication/subCategory",
	isAuthenticated,
    isAdmin,
	validate(subCategoryFilterSchema),
    asyncHandler(async (req: TypedRequest<subCategoryFilter>, res: Response) => {
		const subCategoryFilter = req.validatedData;
		await publicationService.removesubCategory(subCategoryFilter);
		res.status(204);
    })
)

// ? Publication

// post admin
router.post(
    "/publication",
	isAuthenticated,
    isAdmin,
	validate(publicationSchema),
    asyncHandler(async (req: TypedRequest<publication>, res: Response) => {
		const publicationData = req.validatedData;
		const addedPublication = await publicationService.addPublication(publicationData);
		res.status(201).json({ success: true, message: "publication added.", data: addedPublication });
    })
)

// get id
router.get(
    "/publication/find",
    validate(publicationIDSchema),
    asyncHandler(async (req: TypedRequest<publicationID>, res: Response) => {
        const publicationData = req.validatedData;
		const publications = await publicationService.getPublication(publicationData);
		res.json(publications);
    })
)

// get all
router.get(
    "/publication/all",
    asyncHandler(async (req: Request, res: Response) => {
		const publications = await publicationService.getAllPublication();
		res.json(publications);
    })
)

// patch admin
router.patch(
    "/publication",
	isAuthenticated,
    isAdmin,
	validate(publicationPatchSchema),
    asyncHandler(async (req: TypedRequest<publicationPatch>, res: Response) => {
		const publicationData = req.validatedData;
		const patchedPublication = await publicationService.patchPublication(publicationData);
		res.status(201).json({ success: true, message: "publication patched.", data: patchedPublication });
    })
)

// delete admin
router.delete(
    "/publication",
	isAuthenticated,
    isAdmin,
	validate(publicationIDSchema),
    asyncHandler(async (req: TypedRequest<publicationID>, res: Response) => {
		const publicationFilter = req.validatedData;
		await publicationService.removePublication(publicationFilter);
		res.status(204);
    })
)

// ? Metrics

// post admin
router.post(
    "/publication/metrics",
	isAuthenticated,
    isAdmin,
	validate(publicationMetricsSchema),
    asyncHandler(async (req: TypedRequest<publicationMetrics>, res: Response) => {
		const metricsData = req.validatedData;
		const addedMetrics = await publicationService.addMetrics(metricsData);
		res.status(201).json({ success: true, message: "metrics added.", data: addedMetrics });
    })
)

// get id
router.get(
    "/publication/metrics",
    validate(publicationMetricsIDSchema),
    asyncHandler(async (req: TypedRequest<publicationMetricsID>, res: Response) => {
        const metricsData = req.validatedData;
		const metrics = await publicationService.getMetrics(metricsData);
		res.json(metrics);
    })
)


// patch admin
router.patch(
    "/publication/metrics",
	isAuthenticated,
    isAdmin,
	validate(publicationMetricsPatchSchema),
    asyncHandler(async (req: TypedRequest<publicationMetricsPatch>, res: Response) => {
		const metricsData = req.validatedData;
		const patchedMetrics = await publicationService.patchMetrics(metricsData);
		res.status(201).json({ success: true, message: "publication metrics patched.", data: patchedMetrics });
    })
)

// delete admin
router.delete(
    "/publication/metrics",
	isAuthenticated,
    isAdmin,
	validate(publicationMetricsIDSchema),
    asyncHandler(async (req: TypedRequest<publicationMetricsID>, res: Response) => {
		const publicationMetricsFilter = req.validatedData;
		await publicationService.removeMetrics(publicationMetricsFilter);
		res.status(204);
    })
)

export default router;