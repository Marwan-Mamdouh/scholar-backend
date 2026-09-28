import { Router } from "express";
import { getResearchersController } from "../../controllers/researchers/researchersControllers.ts";
const router = Router();


router.get("/", getResearchersController);







export default router;
