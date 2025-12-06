import express from "express";
import { AiController } from "../controllers/ai.controller.js";

const router = express.Router();

//router.post("/parse", AiController.parseVoice);

router.post("/parse-create", AiController.parseVoice);
router.post("/parse-edit", AiController.parseEdit);


export default router;


