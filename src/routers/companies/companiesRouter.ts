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
router.get("/:id", getCompanyByIdController);
router.post("/", isAuthenticated, createCompanyController);
router.patch("/:id", isAuthenticated, updateCompanyController);
router.delete("/:id", isAuthenticated, deleteCompanyController);

export default router;