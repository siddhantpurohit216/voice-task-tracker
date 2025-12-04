import { useState } from "react";
import TaskCard from "./TaskCard";
import TaskFormModal from "../TaskForm/TaskForm.jsx";

import "./Column.css";

export default function Column({ title, tasks }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="column">
      <h2>{title}</h2>

      <div className="column-tasks">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {/* + button below the last card */}
        <button className="add-task-btn" onClick={() => setOpen(true)}>
          +
        </button>
      </div>

      {open && (
        <TaskFormModal
          status={title}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
