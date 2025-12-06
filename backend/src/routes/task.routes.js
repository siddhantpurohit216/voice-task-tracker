import express from "express";
import { TaskController } from "../controllers/task.controller.js";
import { 
  validateTaskQuery, 
  validateTaskBody 
} from "../validators/task.validator.js";


const router = express.Router();

/* -------------------------
     GET ALL TASKS
-------------------------- */
router.get("/", TaskController.getTasks);

/* -------------------------
     CREATE TASK
-------------------------- */
router.post(
  "/", 
  validateTaskBody,   
  TaskController.createTask
);

/* -------------------------
     UPDATE TASK
-------------------------- */
router.patch(
  "/:id",     
  validateTaskBody,    
  TaskController.updateTask
);

/* -------------------------
     DELETE TASK
-------------------------- */
router.delete(
  "/:id", 
  TaskController.deleteTask
);

/* -------------------------
     FILTER + PAGINATION + SEARCH QUERY
-------------------------- */
router.get(
  "/query",
  validateTaskQuery,
  TaskController.queryTasks
);

export default router;
