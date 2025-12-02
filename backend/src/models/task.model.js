import { pool } from "../config/db.js";

export const TaskModel = {
  async getAll() {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY created_at DESC"
    );
    return result.rows;
  },

  async create({ title, description, status, priority, due_date }) {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, priority, due_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description, status, priority, due_date]
    );
    return result.rows[0];
  },

  async update(id, fields) {
    const keys = Object.keys(fields);
    const updates = keys.map((k, i) => `${k}=$${i + 1}`).join(", ");
    const values = Object.values(fields);

    const result = await pool.query(
      `UPDATE tasks SET ${updates}, updated_at=NOW() WHERE id=$${keys.length + 1} RETURNING *`,
      [...values, id]
    );

    return result.rows[0];
  },

  async delete(id) {
    await pool.query("DELETE FROM tasks WHERE id=$1", [id]);
    return true;
  },

  async getByStatus(status) {
    const result = await pool.query("SELECT * FROM tasks WHERE status=$1", [
      status,
    ]);
    return result.rows;
  },
};
