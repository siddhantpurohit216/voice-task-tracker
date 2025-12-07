import dotenv from "dotenv";
dotenv.config();
import { seedTasks } from "./seed/seedTasks.js";
import app from "./app.js";

const PORT = process.env.PORT || 5003;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await seedTasks();
});

