import { useState, useContext } from "react";
import TaskCard from "./TaskCard";
import TaskFormModal from "../TaskForm/TaskForm.jsx";
import { TaskContext } from "../../context/TaskContext";
import { updateTask } from "../../api/tasks";
import "./Column.css";

export default function Column({ title, tasks }) {
  const [open, setOpen] = useState(false);
  const { setTasks } = useContext(TaskContext);

  const iconMap = {
    "To Do": "⭕",
    "In Progress": "🟡",
    "Done": "🟢",
  };

  /** 
   * Handle when a task is dropped into this column
   */
  function handleDrop(e) {
    e.preventDefault();

    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;

    // 1️⃣ Update UI immediately
    setTasks((prev) =>
      prev.map((t) =>
        t.id == taskId ? { ...t, status: title } : t
      )
    );

    // 2️⃣ Save to backend
    updateTask(taskId, { status: title });
  }

  return (
    <div
      className="column"
      onDragOver={(e) => e.preventDefault()}  // Allow drop
      onDrop={handleDrop}                     // Handle drop
    >
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
