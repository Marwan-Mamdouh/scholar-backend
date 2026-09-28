import { Router } from "express";
import { getProjectsController } from "../../controllers/projects/projectsController.ts";

const router = Router();


router.get("/", getProjectsController);

export default router;