import { Router } from "express";
import {
    getCompaniesController,
    getCompanyByIdController,
    createCompanyController,
    updateCompanyController,
    deleteCompanyController,
} from "../../controllers/companies/companiesController.js";

const router = Router();


router.get("/", getCompaniesController);
router.get("/:id", getCompanyByIdController);
router.post("/", createCompanyController);
router.patch("/:id", updateCompanyController);
router.delete("/:id", deleteCompanyController);

export default router;