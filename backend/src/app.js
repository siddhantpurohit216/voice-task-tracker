import express from "express";
import cors from "cors";
import taskRoutes from "./routes/task.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
const app = express();

app.use(cors());
app.use(express.json());



app.use("/tasks", taskRoutes);
app.use("/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("Backend is RUNNING!");
});
app.use(errorHandler);

export default app;