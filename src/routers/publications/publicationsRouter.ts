import { Router } from "express";
import {
    getPublicationsController,
    getPublicationByIdController,
    createPublicationController,
    updatePublicationController,
    deletePublicationController
} from "../../controllers/publications/publicationsController.ts";

const router = Router();


router.get("/", getPublicationsController);
router.get("/:id", getPublicationByIdController);
router.post("/", createPublicationController);
router.patch("/:id", updatePublicationController);
router.delete("/:id", deletePublicationController);


export default router;