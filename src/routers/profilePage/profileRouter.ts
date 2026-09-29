import { Router } from "express";
import isAuthenticated from "../../middlewares/auth.js";
import {
    createProfileController,
    updateProfileController,
    getProfileController
} from "../../controllers/profilePage/profileController.js";

const router = Router();

router.post("/", isAuthenticated, createProfileController);  // Insert
router.patch("/", isAuthenticated, updateProfileController); // Update
router.get("/", isAuthenticated, getProfileController);  // Get


export default router;