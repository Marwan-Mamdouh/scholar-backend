import { Router } from "express";
import { getPapersController } from "../../controllers/papers/papersControllers.js";

const router = Router();


router.get("/", getPapersController);

export default router;