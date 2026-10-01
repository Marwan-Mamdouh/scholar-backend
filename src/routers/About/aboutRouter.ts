import { Router } from "express";
import {
    getTeamsController,
    sendContactMessageController,
} from "../../controllers/About/Aboutcontroller.js";

const router = Router();

router.get("/teams", getTeamsController);              //  Meet Our Teams
router.post("/contact", sendContactMessageController); // Start A Conversation

export default router;