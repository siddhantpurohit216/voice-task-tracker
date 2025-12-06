import { pool } from "../config/db.js";

export const TaskModel = {
  async getAll() {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY updated_at DESC"
    );
    return result.rows;
  },

async create({ title, description, status, priority, due_date }) {
  const result = await pool.query(
    `INSERT INTO tasks (title, description, status, priority, due_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      title,
      description,
      status,
      priority,
      due_date || null   // <-- ENSURE NULL IS PASSED
    ]
  );
  return result.rows[0];
}
,

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


  // models/task.model.js
async query({ page, pageSize, status, priority, search, sortBy, sortDir }) {
  let base = `SELECT * FROM tasks`;
  let where = [];
  let params = [];
  let i = 1;

  if (status) {
    where.push(`status = $${i++}`);
    params.push(status);
  }

  if (priority) {
    where.push(`priority = $${i++}`);
    params.push(priority);
  }

  if (search) {
    where.push(`(LOWER(title) LIKE $${i} OR LOWER(description) LIKE $${i})`);
    params.push(`%${search.toLowerCase()}%`);
    i++;
  }

  if (where.length > 0) {
    base += " WHERE " + where.join(" AND ");
  }

  base += ` ORDER BY ${sortBy} ${sortDir}`;

  const offset = (page - 1) * pageSize;
  base += ` LIMIT ${pageSize} OFFSET ${offset}`;

  const result = await pool.query(base, params);
  return result.rows;
}

};
