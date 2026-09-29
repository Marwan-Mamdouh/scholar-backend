import { Router } from "express";
import {
    getProjectsController,
    getProjectsByIdController,
    createProjectController,
    updateProjectController,
    deleteProjectController,
} from "../../controllers/projects/projectsController.ts";

const router = Router();


router.get("/", getProjectsController);
router.get("/:id", getProjectsByIdController);
router.post("/", createProjectController);
router.patch("/:id", updateProjectController);
router.delete("/:id", deleteProjectController);

export default router;