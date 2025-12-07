import { TaskService } from "../services/task.service.js";
import { BadRequestError, NotFoundError } from "../utils/AppError.js";

export const TaskController = {
   async getTasks(req, res) {
    const tasks = await TaskService.getAllTasks();
    res.json(tasks);
  },

 async createTask(req, res) {
    const task = await TaskService.createTask(req.body);
    res.status(201).json(task);
  },

  async updateTask(req, res) {
    const { id } = req.params;

    if (!id) throw new BadRequestError("Task ID missing");

    const updated = await TaskService.updateTask(id, req.body);

    if (!updated) throw new NotFoundError("Task not found");

    res.json(updated);
  },


  async deleteTask(req, res) {
    const { id } = req.params;
    if (!id) throw new BadRequestError("Task ID missing");

    const deleted = await TaskService.deleteTask(id);
    if (!deleted) throw new NotFoundError("Task not found");

    res.json({ message: "Deleted successfully" });
  },

async queryTasks(req, res) {
  try {
    const { 
      page = 1,
      pageSize = 30,
      status,
      priority,
      search,
      sortBy = "updated_at",
      sortDir = "desc"
    } = req.query;

    const result = await TaskService.queryTasks({
      page,
      pageSize,
      status,
      priority,
      search,
      sortBy,
      sortDir
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

};
