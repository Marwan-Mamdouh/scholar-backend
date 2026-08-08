import { Router, type Request, type Response } from "express";
import isAuthenticated from "../../middlewares/auth.js";
import isAdmin from "../../middlewares/authorize.js";
import asyncHandler from "../../lib/async.handler.js";
import { validate } from "../../middlewares/validator.js";
import { domainFilterSchema, publicationFilterSchema, domainSchema , publicationIDSchema, publicationMetricsIDSchema, publicationMetricsPatchSchema, publicationMetricsSchema, publicationPatchSchema, publicationSchema, subCategoryFilterSchema, subCategorySchema,type PublicationEditorialStatPatch, type PublicationEditorialStat, type publicationFilterInput, type domain, type domainFilter, type publication, type publicationID, type publicationMetrics, type publicationMetricsID, type publicationMetricsPatch, type publicationPatch, type subCategory, type subCategoryFilter, publicationEditorialStatSchema, type publicationEditorialStatsID, publicationPricingSchema, type PublicationPricing, publicationPricingPatchSchema, type PublicationPricingPatch } from "./publication.schema.js";
import publicationService from "./publication.service.js";
import type { TypedRequest } from "../../types/Request.js";
import type { PaginatedRequest } from "../../types/paginatedRequest.js";
import { paginationMiddleware as pagination } from "../../middlewares/pagination.js"; 

const router = Router();

// ? domains 

// post admin
router.post(
    "/domain",
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
    "/domain",
    asyncHandler(async (req: Request, res: Response) => {
		const domains = await publicationService.getAllDomains();
		res.json(domains);
    })
)
// delete admin
router.delete(
    "/domain",
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
    "/subCategory",
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
    "/subCategory",
    asyncHandler(async (req: Request, res: Response) => {
		const subcategories = await publicationService.getAllSubcategories();
		res.json(subcategories);
    })
)

// delete admin
router.delete(
    "/subCategory",
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
    "/",
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
    "/find",
    validate(publicationIDSchema,"query"),
    asyncHandler(async (req: TypedRequest<publicationID>, res: Response) => {
        const publicationData = req.validatedData;
		const publications = await publicationService.getPublication(publicationData);
		res.json(publications);
    })
)

// get filter
router.post(
    "/filter",
    validate(publicationFilterSchema),
    asyncHandler(async (req: TypedRequest<publicationFilterInput>, res: Response) => {
        const publicationData = req.validatedData;
		const publications = await publicationService.getPublicationFiltered(publicationData);
		res.json(publications);
    })
)

// get filter
router.get(
    "/filter",
    asyncHandler(async (req: Request, res: Response) => {
		const filterLimits = await publicationService.getFilterRanges();
		res.json(filterLimits);
    })
)

// get all
router.get(
    "/all",
    asyncHandler(async (req: Request, res: Response) => {
		const publications = await publicationService.getAllPublication();
		res.json(publications);
    })
)

// patch admin
router.patch(
    "/",
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
    "/",
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
    "/metrics",
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
    "/metrics",
    validate(publicationMetricsIDSchema,"query"),
    asyncHandler(async (req: TypedRequest<publicationMetricsID>, res: Response) => {
        const metricsData = req.validatedData;
		const metrics = await publicationService.getMetrics(metricsData);
		res.json(metrics);
    })
)


// patch admin
router.patch(
    "/metrics",
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
    "/metrics",
	isAuthenticated,
    isAdmin,
	validate(publicationMetricsIDSchema),
    asyncHandler(async (req: TypedRequest<publicationMetricsID>, res: Response) => {
		const publicationMetricsFilter = req.validatedData;
		await publicationService.removeMetrics(publicationMetricsFilter);
		res.status(204);
    })
)

// ? editorial_stats

// post admin
router.post(
    "/editorial_stats",
	isAuthenticated,
    isAdmin,
	validate(publicationEditorialStatSchema),
    asyncHandler(async (req: TypedRequest<PublicationEditorialStat>, res: Response) => {
		const editorialStatsData = req.validatedData;
		const addedeEitorialStats = await publicationService.addEditorialStats(editorialStatsData);
		res.status(201).json({ success: true, message: "Eitorial Stats added.", data: addedeEitorialStats });
    })
)

// get id
router.get(
    "/editorial_stats",
    validate(publicationIDSchema,"query"),
    asyncHandler(async (req: TypedRequest<publicationID>, res: Response) => {
        const editorialStatsData = req.validatedData;
		const editorialStats = await publicationService.getEditorialStats(editorialStatsData);
		res.json(editorialStats);
    })
)


// patch admin
router.patch(
    "/editorial_stats",
	isAuthenticated,
    isAdmin,
	validate(publicationMetricsPatchSchema),
    asyncHandler(async (req: TypedRequest<PublicationEditorialStatPatch>, res: Response) => {
		const editorialStatData = req.validatedData;
		const patchedEditorialStat = await publicationService.patchEditorialStat(editorialStatData);
		res.status(201).json({ success: true, message: "publication EditorialStat patched.", data: patchedEditorialStat });
    })
)

// delete admin
router.delete(
    "/editorial_stats",
	isAuthenticated,
    isAdmin,
	validate(publicationIDSchema),
    asyncHandler(async (req: TypedRequest<publicationID>, res: Response) => {
		const editorialStatFilter = req.validatedData;
		await publicationService.removeEditorialStat(editorialStatFilter);
		res.status(204);
    })
)
// ? pricing

// post admin
router.post(
    "/pricing",
	isAuthenticated,
    isAdmin,
	validate(publicationPricingSchema),
    asyncHandler(async (req: TypedRequest<PublicationPricing>, res: Response) => {
		const pricingData = req.validatedData;
		const addedePricing = await publicationService.addPricing(pricingData);
		res.status(201).json({ success: true, message: "Pricing added.", data: addedePricing });
    })
)

// get id
router.get(
    "/pricing",
    validate(publicationIDSchema,"query"),
    asyncHandler(async (req: TypedRequest<publicationID>, res: Response) => {
        const pricingData = req.validatedData;
		const pricing = await publicationService.getPricing(pricingData);
		res.json(pricing);
    })
)


// patch admin
router.patch(
    "/pricing",
	isAuthenticated,
    isAdmin,
	validate(publicationPricingPatchSchema),
    asyncHandler(async (req: TypedRequest<PublicationPricingPatch>, res: Response) => {
		const pricingData = req.validatedData;
		const patchedPricing = await publicationService.patchPricing(pricingData);
		res.status(201).json({ success: true, message: "publication pricing patched.", data: patchedPricing });
    })
)

// delete admin
router.delete(
    "/pricing",
	isAuthenticated,
    isAdmin,
	validate(publicationIDSchema),
    asyncHandler(async (req: TypedRequest<publicationID>, res: Response) => {
		const pricingFilter = req.validatedData;
		await publicationService.removePricing(pricingFilter);
		res.status(204);
    })
)

export default router;