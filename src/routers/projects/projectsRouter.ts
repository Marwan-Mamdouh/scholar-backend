import { Router } from "express";
import {
    getProjectYears,
    getProjectsController,
    getProjectsByIdController,
    getCatalogProjectController,
    createProjectController,
    updateProjectController,
    deleteProjectController,
} from "../../controllers/projects/projectsController.js";
import isAuthenticated from "../../middlewares/auth.js";

const router = Router();


router.get("/", getProjectsController);
router.get("/years", getProjectYears);
router.get("/catalog/:id", getCatalogProjectController);
router.get("/:id", getProjectsByIdController);
router.post("/", isAuthenticated, createProjectController);
router.patch("/:id", isAuthenticated, updateProjectController);
router.delete("/:id", isAuthenticated, deleteProjectController);

export default router;