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

  // sort by updated_at DESC
  const sorted = data.sort(
    (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
  );

  setTasks(sorted);
}


  return (
    <TaskContext.Provider value={{ tasks, setTasks, loadTasks }}>
      {children}
    </TaskContext.Provider>
  );
}
