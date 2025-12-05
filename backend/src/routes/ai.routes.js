import express from "express";
import { AiController } from "../controllers/ai.controller.js";

const router = express.Router();

//router.post("/parse", AiController.parseVoice);

router.post("/ai/parse-create", AiController.parseVoice);
router.post("/ai/parse-edit", AiController.parseEdit);


export default router;


