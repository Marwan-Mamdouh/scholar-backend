import { Router } from "express";
import { getAllResearchersController, getResearchersByQueryController } from "../../controllers/researchers/researchersControllers.ts";
const router = Router();


router.get("/", getAllResearchersController);

router.get("/search", getResearchersByQueryController);






export default router;
