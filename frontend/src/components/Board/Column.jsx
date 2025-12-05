import { useState } from "react";
import TaskCard from "./TaskCard";
import TaskFormModal from "../TaskForm/TaskForm.jsx";
import "./Column.css";

export default function Column({ title, tasks }) {
  const [open, setOpen] = useState(false);

  const iconMap = {
    "To Do": "⭕",
    "In Progress": "🟡",
    "Done": "🟢",
  };

  return (
    <div className="column">

      {/* Header */}
      <div className="column-header">
        <span className="column-icon">{iconMap[title]}</span>
        <h2>{title}</h2>
        <span className="column-count">{tasks.length}</span>
      </div>

      {/* Scrollable Tasks Area */}
      <div className="column-tasks">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Sticky Add Button */}
      <button className="add-task-btn" onClick={() => setOpen(true)}>
        +
      </button>

      {/* Modal */}
      {open && (
        <TaskFormModal
          status={title}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
