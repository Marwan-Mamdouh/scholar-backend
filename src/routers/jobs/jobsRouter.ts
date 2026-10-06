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

import { 
    recordJobVisitController, 
    markJobTakenController, 
    insertBatchJobsController 
} from "../../controllers/jobs/jobsController.js";

router.post("/visit", recordJobVisitController);
router.post("/:id/visit", recordJobVisitController);
router.post("/take", markJobTakenController);
router.post("/:id/take", markJobTakenController);
router.post("/insert", insertBatchJobsController);
router.post("/batch", insertBatchJobsController);

export default router;