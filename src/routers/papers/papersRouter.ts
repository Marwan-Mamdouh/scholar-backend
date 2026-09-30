import { Router } from "express";
import {
    createPaperController,
    deletePaperController,
    getPapersByIdController,
    getPapersController,
    updatePaperController,
} from "../../controllers/papers/papersControllers.js";
import isAuthenticated from "../../middlewares/auth.js";
const router = Router();

router.get("/", getPapersController);
router.get("/:id", getPapersByIdController);
router.post("/", isAuthenticated, createPaperController);
router.patch("/:id", isAuthenticated, updatePaperController);
router.delete("/:id", isAuthenticated, deletePaperController);

export default router;