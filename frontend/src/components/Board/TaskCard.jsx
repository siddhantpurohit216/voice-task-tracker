import { useState } from "react";
import TaskFormModal from "../TaskForm/TaskForm.jsx";
import "./TaskCard.css";

export default function TaskCard({ task }) {
  const [openEdit, setOpenEdit] = useState(false);

  const { label, status } = getDueStatus(task.due_date);

  function getDueStatus(dateString) {
    if (!dateString) return { label: "", status: "normal" };

    const date = new Date(dateString);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    const due = new Date(dateString);
    due.setHours(0, 0, 0, 0);

    const diff = (due - today) / (1000 * 60 * 60 * 24);

    if (diff === 0) return { label: "Today", status: "today" };
    if (diff === 1) return { label: "Tomorrow", status: "tomorrow" };
    if (diff < 0) return { label: "Overdue", status: "overdue" };

    return {
      label: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      status: "normal"
    };
  }

  return (
    <>
      <div
        className="task-card"
        draggable    
       onDragStart={(e) => {
    e.dataTransfer.setData("task", JSON.stringify(task)); 
  }}
      >
        {/* EDIT BUTTON (appears on hover) */}
        <button
          className="edit-btn"
          onClick={() => setOpenEdit(true)}
        >
          ✏️
        </button>

        <h4 className="task-title">{task.title}</h4>

        <div className="task-meta">
          {task.due_date && (
            <span className={`due due-${status}`}>{label}</span>
          )}

          <span className={`priority-badge ${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
        </div>
      </div>

      {/* EDIT MODAL */}
      {openEdit && (
        <TaskFormModal
          onClose={() => setOpenEdit(false)}
          existingTask={task}
          mode="edit"
        />
      )}
    </>
  );
}
