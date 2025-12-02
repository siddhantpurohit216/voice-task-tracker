import { TaskService } from "../services/task.service.js";

export const TaskController = {
  async getTasks(req, res) {
    const tasks = await TaskService.getAllTasks();
    res.json(tasks);
  },

  async createTask(req, res) {
    try {
      const task = await TaskService.createTask(req.body);
      res.status(201).json(task);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updateTask(req, res) {
    const { id } = req.params;
    const updated = await TaskService.updateTask(id, req.body);
    res.json(updated);
  },

  async deleteTask(req, res) {
    const { id } = req.params;
    await TaskService.deleteTask(id);
    res.json({ message: "Deleted successfully" });
  },
};
