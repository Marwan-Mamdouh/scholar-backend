import { Router } from "express";
import {
    getJobsController,
    getJobByIdController,
    createJobController,
    updateJobController,
    deleteJobController,
} from "../../controllers/jobs/jobsController.js";

import isAuthenticated from "../../middlewares/auth.js";

const router = Router();


router.get("/", getJobsController);
router.get("/:id", getJobByIdController);
router.post("/", isAuthenticated, createJobController);
router.patch("/:id", isAuthenticated, updateJobController);
router.delete("/:id", isAuthenticated, deleteJobController);

export default router;