import { Router } from "express";
import {
    getResearchersController, getResearcherByIdController, createResearcherController, updateResearcherController,
    deleteResearcherController,
} from "../../controllers/researchers/researchersControllers.ts";
const router = Router();


router.get("/", getResearchersController);
router.get("/:id", getResearcherByIdController);
router.post("/", createResearcherController);
router.patch("/:id", updateResearcherController);
router.delete("/:id", deleteResearcherController);


export default router;
