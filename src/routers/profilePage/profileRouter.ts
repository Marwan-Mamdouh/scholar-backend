import { Router } from "express";
import isAuthenticated from "../../middlewares/auth.js";
import {
    createProfileController,
    updateProfileController,
} from "../../controllers/profilePage/profileController.js";

const router = Router();

router.post("/:userId", isAuthenticated, createProfileController);  // Insert
router.patch("/:userId", isAuthenticated, updateProfileController); // Update

export default router;