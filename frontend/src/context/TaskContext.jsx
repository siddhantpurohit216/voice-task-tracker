import { createContext, useState } from "react";

export const TaskContext = createContext();

export default function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]); 
  // used only for UI sync (drag + drop)

  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
}
