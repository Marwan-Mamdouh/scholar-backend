import { Router } from "express";
import {
    createPaperController,
    deletePaperController,
    getPapersByIdController,
    getPapersController,
    updatePaperController,
} from "../../controllers/papers/papersControllers.js";

const router = Router();

router.get("/", getPapersController);
router.get("/:id", getPapersByIdController);
router.post("/", createPaperController);
router.patch("/:id", updatePaperController);
router.delete("/:id", deletePaperController);

export default router;