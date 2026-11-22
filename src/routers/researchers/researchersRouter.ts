import { Router } from "express";
import {
    getResearcherFacets,
    getResearchersController, getResearcherByIdController, createResearcherController, updateResearcherController,
    deleteResearcherController,
} from "../../controllers/researchers/researchersControllers.js";
import isAuthenticated from "../../middlewares/auth.js";

const router = Router();


router.get("/", getResearchersController);
router.get("/filters", getResearcherFacets);
router.get("/:id", getResearcherByIdController);
router.post("/", isAuthenticated, createResearcherController);
router.patch("/:id", isAuthenticated, updateResearcherController);
router.delete("/:id", isAuthenticated, deleteResearcherController);


export default router;
