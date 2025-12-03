import { createContext, useEffect, useState } from "react";
import { fetchTasks } from "../api/tasks";

export const TaskContext = createContext();

export default function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const data = await fetchTasks();
    setTasks(data);
  }

  return (
    <TaskContext.Provider value={{ tasks, setTasks, loadTasks }}>
      {children}
    </TaskContext.Provider>
  );
}
