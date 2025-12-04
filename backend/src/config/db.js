import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
});

// ----------------------
// TEST CONNECTION
// ----------------------
pool.connect()
  .then(() => {
    console.log("✅ DB CONNECTED");
  })
  .catch((err) => {
    console.error("❌ DB CONNECTION ERROR");
    console.error("Message:", err.message);
    console.error("Code:", err.code);
    console.error("Details:", err);
  });
