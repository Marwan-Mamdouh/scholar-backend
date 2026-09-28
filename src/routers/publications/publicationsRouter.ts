import { Router } from "express";
import { getPublicationsController } from "../../controllers/publications/publicationsController.ts";

const router = Router();


router.get("/", getPublicationsController);

export default router;