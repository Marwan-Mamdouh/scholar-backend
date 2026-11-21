import { Router } from "express";
import {
    getPublicationsController,
    getPublicationFiltersController,
    getPublicationByIdController,
    createPublicationController,
    updatePublicationController,
    deletePublicationController
} from "../../controllers/publications/publicationsController.js";
import isAuthenticated from "../../middlewares/auth.js";

const router = Router();


router.get("/", getPublicationsController);
router.get("/filters", getPublicationFiltersController);
router.get("/:id", getPublicationByIdController);
router.post("/", isAuthenticated, createPublicationController);
router.patch("/:id", isAuthenticated, updatePublicationController);
router.delete("/:id", isAuthenticated, deletePublicationController);


export default router;