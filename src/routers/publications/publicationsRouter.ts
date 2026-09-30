import { Router } from "express";
import {
    getPublicationsController,
    getPublicationByIdController,
    createPublicationController,
    updatePublicationController,
    deletePublicationController
} from "../../controllers/publications/publicationsController.ts";
import isAuthenticated from "../../middlewares/auth.ts";

const router = Router();


router.get("/", getPublicationsController);
router.get("/:id", getPublicationByIdController);
router.post("/", isAuthenticated, createPublicationController);
router.patch("/:id", isAuthenticated, updatePublicationController);
router.delete("/:id", isAuthenticated, deletePublicationController);


export default router;