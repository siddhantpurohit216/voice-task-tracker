import { TaskModel } from "../models/task.model.js";

export const TaskService = {
  async getAllTasks() {
    return TaskModel.getAll();
  },

  async createTask(data) {
    return TaskModel.create(data);
  },

  async updateTask(id, data) {
    return TaskModel.update(id, data);
  },

  async deleteTask(id) {
    return TaskModel.delete(id);
  },

  async filterByStatus(status) {
    return TaskModel.getByStatus(status);
  },
};
