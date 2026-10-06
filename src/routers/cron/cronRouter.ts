import { Router } from "express";
import { cleanupJobsCronController, syncCompanyStatsCronController } from "../../controllers/cron/cronController.js";

const router = Router();

router.get("/cleanup-jobs", cleanupJobsCronController);
router.get("/sync-company-stats", syncCompanyStatsCronController);

export default router;
