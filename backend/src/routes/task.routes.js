import express from "express";
import { TaskController } from "../controllers/task.controller.js";
import { AiController } from "../controllers/ai.controller.js";


const router = express.Router();

router.get("/", TaskController.getTasks);
router.post("/", TaskController.createTask);
router.patch("/:id", TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);


export default router;
