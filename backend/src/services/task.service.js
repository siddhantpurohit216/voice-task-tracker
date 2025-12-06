import { TaskModel } from "../models/task.model.js";
import { NotFoundError } from "../utils/AppError.js";

export const TaskService = {

  async getAllTasks() {
    return TaskModel.getAll();
  },

  async createTask(data) {
    return TaskModel.create(data);
  },

  async updateTask(id, data) {
    const updated = await TaskModel.update(id, data);
    if (!updated) throw new NotFoundError("Task not found");
    return updated;
  },

  async deleteTask(id) {
    const deleted = await TaskModel.delete(id);
    if (!deleted) throw new NotFoundError("Task not found");
    return deleted;
  },

  async queryTasks(filters) {
    return TaskModel.query(filters);
  }
};
