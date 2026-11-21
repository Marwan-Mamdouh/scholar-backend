import { Router } from "express";
import {
    getCompaniesController,
    getCompanyByIdController,
    createCompanyController,
    updateCompanyController,
    deleteCompanyController,
} from "../../controllers/companies/companiesController.js";

import isAuthenticated from "../../middlewares/auth.js";

const router = Router();


router.get("/", getCompaniesController);

import { 
    getCompanyMonthlyStatsController, 
    syncCompanyStatsController, 
    purgeCompanyStatsController 
} from "../../controllers/companies/companiesController.js";

router.get("/stats/monthly", getCompanyMonthlyStatsController);
router.get("/monthly-stats", getCompanyMonthlyStatsController);
router.post("/stats/sync", syncCompanyStatsController);
router.post("/stats/purge", purgeCompanyStatsController);

router.get("/:id", getCompanyByIdController);
router.post("/", isAuthenticated, createCompanyController);
router.patch("/:id", isAuthenticated, updateCompanyController);
router.delete("/:id", isAuthenticated, deleteCompanyController);

export default router;