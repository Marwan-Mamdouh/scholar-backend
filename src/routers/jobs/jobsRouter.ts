import { Router } from "express";
import {
    getJobsController,
    getJobByIdController,
    createJobController,
    updateJobController,
    deleteJobController,
} from "../../controllers/jobs/jobsController.js";

const router = Router();


router.get("/", getJobsController);
router.get("/:id", getJobByIdController);
router.post("/", createJobController);
router.patch("/:id", updateJobController);
router.delete("/:id", deleteJobController);

export default router;