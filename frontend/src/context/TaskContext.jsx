import { createContext, useState } from "react";

export const TaskContext = createContext();

export default function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]); 
  const [taskEvents, setTaskEvents] = useState({
    created: null,
    updated: null,
    moved: null,
    deleted: null,
  });

  return (
    <TaskContext.Provider value={{ tasks, setTasks, taskEvents, setTaskEvents }}>
      {children}
    </TaskContext.Provider>
  );
}
