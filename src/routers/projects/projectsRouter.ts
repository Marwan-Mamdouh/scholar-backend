import { Router } from "express";
import {
    getProjectsController,
    getProjectsByIdController,
    createProjectController,
    updateProjectController,
    deleteProjectController,
} from "../../controllers/projects/projectsController.ts";
import isAuthenticated from "../../middlewares/auth.js";

const router = Router();


router.get("/", getProjectsController);
router.get("/:id", getProjectsByIdController);
router.post("/", isAuthenticated, createProjectController);
router.patch("/:id", isAuthenticated, updateProjectController);
router.delete("/:id", isAuthenticated, deleteProjectController);

export default router;