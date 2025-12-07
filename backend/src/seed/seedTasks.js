import { TaskService } from "../services/task.service.js";
import { pool } from "../config/db.js";

const PRIORITIES = ["High", "Medium", "Low"];
const STATUSES = ["To Do", "In Progress", "Done"];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomDate() {

  const today = new Date();
  const offset = Math.floor(Math.random() * 30);
  today.setDate(today.getDate() + offset);
  return today.toISOString();
}

async function hasExistingTasks() {
  const result = await pool.query("SELECT COUNT(*) FROM tasks");
  return Number(result.rows[0].count) > 10;
}

export async function seedTasks() {
  try {
    const exists = await hasExistingTasks();
    if (exists) {
      console.log("Tasks already exist. Skipping seeding.");
      return;
    }

    console.log("Seeding 20 tasks...");

    const tasks = [];

    for (let i = 1; i <= 20; i++) {
      const task = {
        title: `Seed Task ${i}`,
        description: `This is auto-generated task number ${i}.`,
        priority: randomItem(PRIORITIES),
        status: randomItem(STATUSES),
        due_date: generateRandomDate()
      };

      const created = await TaskService.createTask(task);
      tasks.push(created);
    }

    console.log("Seeding complete! Inserted 20 tasks.");
    return tasks;

  } catch (err) {
    console.error("Seeder error:", err);
  }
}
